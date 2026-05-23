'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { Product } from '@/types/product';
import { Order, OrderStatus } from '@/types/order';

const PRODUCTS_PATH = path.join(process.cwd(), 'data', 'products.json');
const ORDERS_PATH = path.join(process.cwd(), 'data', 'orders.json');

// Helper to ensure data directory and files exist
async function ensureDbExists() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // Already exists or permission error handled
  }

  try {
    await fs.access(PRODUCTS_PATH);
  } catch {
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }

  try {
    await fs.access(ORDERS_PATH);
  } catch {
    await fs.writeFile(ORDERS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Read all products
export async function getProducts(): Promise<Product[]> {
  await ensureDbExists();
  try {
    const data = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('Error reading products database:', error);
    return [];
  }
}

// Add a product
export async function addProductAction(product: Product): Promise<Product> {
  await ensureDbExists();
  try {
    const products = await getProducts();
    products.push(product);
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');
    return product;
  } catch (error) {
    console.error('Error adding product to database:', error);
    throw new Error('Failed to add product');
  }
}

// Update a product
export async function updateProductAction(id: string, updatedFields: Partial<Product>): Promise<Product> {
  await ensureDbExists();
  try {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    // Create a sanitized copy of incoming fields to avoid invalid JSON and accidental id changes
    const sanitized: Partial<Product> = { ...updatedFields };
    // Never allow id to be changed via update payload
    if ('id' in sanitized) delete (sanitized as any).id;

    // Coerce numeric fields and ignore invalid values (preserve existing values)
    if (sanitized.price !== undefined) {
      const num = Number(sanitized.price as unknown);
      if (Number.isFinite(num)) sanitized.price = num;
      else delete sanitized.price;
    }
    if (sanitized.stock !== undefined) {
      const num = Number(sanitized.stock as unknown);
      if (Number.isFinite(num)) sanitized.stock = Math.max(0, Math.trunc(num));
      else delete sanitized.stock;
    }

    const updatedProduct = { ...products[index], ...sanitized };
    products[index] = updatedProduct;

    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/admin');
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product in database:', error);
    // Surface original error message when possible for easier debugging
    throw new Error(`Failed to update product: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Delete a product
export async function deleteProductAction(id: string): Promise<boolean> {
  await ensureDbExists();
  try {
    const products = await getProducts();
    const filtered = products.filter(p => p.id !== id);
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');
    return true;
  } catch (error) {
    console.error('Error deleting product from database:', error);
    throw new Error('Failed to delete product');
  }
}

// Read all orders
export async function getOrders(): Promise<Order[]> {
  await ensureDbExists();
  try {
    const data = await fs.readFile(ORDERS_PATH, 'utf-8');
    return JSON.parse(data) as Order[];
  } catch (error) {
    console.error('Error reading orders database:', error);
    return [];
  }
}

// Create an order (Transaction-safe stock verification)
export async function createOrderAction(order: Order): Promise<{ success: boolean; error?: string }> {
  await ensureDbExists();
  try {
    const products = await getProducts();
    const orders = await getOrders();

    // Verify stock for all items
    for (const item of order.items) {
      const dbProduct = products.find(p => p.id === item.id);
      if (!dbProduct) {
        return { success: false, error: `Product "${item.name}" not found in inventory` };
      }
      if (dbProduct.stock < item.quantity) {
        return { success: false, error: `Insufficient stock for "${item.name}". Only ${dbProduct.stock} left!` };
      }
    }

    // Deduct stock
    const updatedProducts = products.map(p => {
      const item = order.items.find(i => i.id === p.id);
      if (item) {
        return { ...p, stock: Math.max(0, p.stock - item.quantity) };
      }
      return p;
    });

    // Save updated products and new order
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(updatedProducts, null, 2), 'utf-8');
    orders.unshift(order);
    await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');
    
    // Also revalidate detail pages for purchased items
    for (const item of order.items) {
      revalidatePath(`/products/${item.id}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating order in database:', error);
    return { success: false, error: 'Database error occurred during checkout. Please try again.' };
  }
}

// Update order status
export async function updateOrderStatusAction(id: string, status: OrderStatus): Promise<Order> {
  await ensureDbExists();
  try {
    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');

    orders[index].status = status;
    await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8');
    revalidatePath('/admin');
    return orders[index];
  } catch (error) {
    console.error('Error updating order status in database:', error);
    throw new Error('Failed to update order status');
  }
}
