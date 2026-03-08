import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// สั่งให้ Astro ไปดึงข้อมูลจากไฟล์ .json ทุกไฟล์ในโฟลเดอร์ locations
const locations = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/locations" }),
});

export const collections = { locations };