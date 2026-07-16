import { defineCollection, z } from 'astro:content'; // 👈 เพิ่ม z เข้ามาตรงนี้
import { glob } from 'astro/loaders';

// 1. คอลเลกชัน Locations
const locations = defineCollection({
  // 👇 1. เปลี่ยนจาก .mdoc เป็น .md 
  loader: glob({ pattern: "**/*.md", base: "./src/content/locations" }),
  
  // 👇 2. เพิ่ม Schema เพื่ออ่านค่า Frontmatter จากไฟล์ .md
  schema: z.object({
    name: z.string(),
    province: z.string().default('chainat'),
    coordinates: z.object({
      lat: z.string().optional(),
      lng: z.string().optional(),
    }).optional(),
    supplyChainStage: z.string().optional(),
    // อนุญาตให้ฟิลด์อื่นๆ ผ่านได้ถ้าต้องการเพิ่มเติมภายหลัง
    images: z.array(z.string()).optional(),
    // 👇 1. เพิ่มโครงสร้างของ "ผลผลิต / ผลิตภัณฑ์" ตรงนี้ 👇
    productList: z.array(
      z.object({
        name: z.string(),
        standards: z.array(z.string()).optional(),
        productImage: z.string().optional(),
      })
    ).optional(),

    // 👇 2. เพิ่มโครงสร้างของ "ช่องทางการสื่อสาร" ตรงนี้ 👇
    contacts: z.array(
      z.object({
        type: z.string(),
        label: z.string().optional(),
        value: z.string(),
      })
    ).optional(),
  })
});

// 2. คอลเลกชัน Networks
const networks = defineCollection({
  // 👇 1. เปลี่ยนจาก .mdoc เป็น .md
  loader: glob({ pattern: "**/*.md", base: "./src/content/networks" }),
  
  // 👇 2. เพิ่ม Schema
  schema: z.object({
    name: z.string(),
    province: z.string().default('chainat'),
    imageUrl: z.string().optional(),
  })
});

export const collections = { locations, networks }; // 👈 ส่งออกเหมือนเดิม