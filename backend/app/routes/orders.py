from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])


class OrderBase(BaseModel):
    order_number: str
    customer_name: str
    customer_avatar: Optional[str] = ""
    order_date: str
    status: str
    total_amount: float
    payment_status: str


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    customer_name: Optional[str]
    customer_avatar: Optional[str]
    order_date: Optional[str]
    status: Optional[str]
    total_amount: Optional[float]
    payment_status: Optional[str]


@router.get("")
def list_orders(status: Optional[str] = Query(None), limit: int = 100, offset: int = 0):
    """List orders with optional status filter."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            if status:
                cursor.execute(
                    "SELECT * FROM orders WHERE status = ? ORDER BY id LIMIT ? OFFSET ?",
                    (status, limit, offset),
                )
            else:
                cursor.execute("SELECT * FROM orders ORDER BY id LIMIT ? OFFSET ?", (limit, offset))
            rows = cursor.fetchall()
            orders = [dict(row) for row in rows]
            return {"orders": orders, "count": len(orders)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{order_id}")
def get_order(order_id: int):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
            row = cursor.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Order not found")
            return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("", status_code=201)
def create_order(order: OrderCreate):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO orders (order_number, customer_name, customer_avatar, order_date, status, total_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    order.order_number,
                    order.customer_name,
                    order.customer_avatar,
                    order.order_date,
                    order.status,
                    order.total_amount,
                    order.payment_status,
                ),
            )
            order_id = cursor.lastrowid
            return {"id": order_id, **order.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{order_id}")
def update_order(order_id: int, order: OrderUpdate):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM orders WHERE id = ?", (order_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Order not found")

            # Build update dynamically
            fields = []
            values = []
            for key, val in order.dict(exclude_unset=True).items():
                fields.append(f"{key} = ?")
                values.append(val)
            if fields:
                values.append(order_id)
                sql = f"UPDATE orders SET {', '.join(fields)} WHERE id = ?"
                cursor.execute(sql, tuple(values))
            cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
            return dict(cursor.fetchone())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM orders WHERE id = ?", (order_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Order not found")
            cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
            return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Bulk endpoints


class BulkStatusUpdate(BaseModel):
    ids: List[int]
    status: str


@router.put("/bulk/status")
def bulk_update_status(payload: BulkStatusUpdate):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                f"UPDATE orders SET status = ? WHERE id IN ({','.join(['?']*len(payload.ids))})",
                tuple([payload.status] + payload.ids),
            )
            return {"updated": cursor.rowcount}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


class BulkDuplicateRequest(BaseModel):
    ids: List[int]


@router.post("/bulk/duplicate")
def bulk_duplicate(payload: BulkDuplicateRequest):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            duplicated_ids = []
            for oid in payload.ids:
                cursor.execute("SELECT order_number, customer_name, customer_avatar, order_date, status, total_amount, payment_status FROM orders WHERE id = ?", (oid,))
                row = cursor.fetchone()
                if row:
                    # create a new order with a new order_number
                    new_order_number = f"{row['order_number']}-COPY"
                    cursor.execute(
                        "INSERT INTO orders (order_number, customer_name, customer_avatar, order_date, status, total_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (new_order_number, row['customer_name'], row['customer_avatar'], row['order_date'], row['status'], row['total_amount'], row['payment_status']),
                    )
                    duplicated_ids.append(cursor.lastrowid)
            return {"duplicated_ids": duplicated_ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


class BulkDeleteRequest(BaseModel):
    ids: List[int]


@router.delete("/bulk")
def bulk_delete(payload: BulkDeleteRequest):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            if not payload.ids:
                return {"deleted": 0}
            cursor.execute(
                f"DELETE FROM orders WHERE id IN ({','.join(['?']*len(payload.ids))})",
                tuple(payload.ids),
            )
            return {"deleted": cursor.rowcount}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
