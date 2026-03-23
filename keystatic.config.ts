// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: process.env.NODE_ENV === 'development'
    ? { kind: 'local' } 
    : { 
        kind: 'github', 
        repo: 'pradit.lee/foodmap' // ⚠️ แก้ตรงนี้เป็นชื่อ GitHub ของคุณ เช่น 'my-name/foodmap'
      },
  collections: {
    // 1. เพิ่มคอลเลกชัน "เครือข่าย (Networks)" ใหม่
    networks: collection({
      label: 'เครือข่าย (Networks)',
      slugField: 'name',
      path: 'src/content/networks/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'ชื่อเครือข่าย' } }),
        province: fields.select({
          label: 'จังหวัดที่เครือข่ายนี้อยู่',
          options: [
            { label: 'ชัยนาท', value: 'chainat' },
            { label: 'สุพรรณบุรี', value: 'suphanburi' },
            { label: 'นครปฐม', value: 'nakhonpathom' },
            { label: 'นนทบุรี', value: 'nonthaburi' },
          ],
          defaultValue: 'chainat',
        }),
        description: fields.text({ 
          label: 'คำอธิบายเครือข่ายแบบย่อ', 
          multiline: true 
        }),
        content: fields.document({
          label: 'รายละเอียดเครือข่ายแบบเต็ม',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      }
    }),

    // 2. อัปเดตคอลเลกชัน "สถานที่ (Locations)" เดิม
    locations: collection({
      label: 'สถานที่ (Locations)',
      slugField: 'name',
      path: 'src/content/locations/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'ชื่อสถานที่' } }),
        
        // 👇 เพิ่ม Field Relationship ตรงนี้
        network: fields.relationship({
          label: 'สังกัดเครือข่าย',
          collection: 'networks',
          description: 'เลือกเครือข่ายที่สถานที่นี้สังกัด (ถ้ามี)'
        }),
        coordinates: fields.object({
          lat: fields.number({ label: 'Latitude' }),
          lng: fields.number({ label: 'Longitude' }),
        }),
        province: fields.select({
          label: 'จังหวัด',
          options: [
            { label: 'ชัยนาท', value: 'chainat' },
            { label: 'สุพรรณบุรี', value: 'suphanburi' },
            { label: 'นครปฐม', value: 'nakhonpathom' },
            { label: 'นนทบุรี', value: 'nonthaburi' },
          ],
          defaultValue: 'chainat',
        }),
        district: fields.text({ label: 'อำเภอ' }),
        category: fields.select({
          label: 'ประเภทสถานที่',
          options: [
            { label: 'โรงเรียน', value: 'school' },
            { label: 'โรงพยาบาล', value: 'hospital' },
            { label: 'หน่วยงานราชการ', value: 'government' },
            { label: 'เอกชน', value: 'private' },
            { label: 'อื่นๆ', value: 'other' },
          ],
          defaultValue: 'other',
        }),
        supplyChain: fields.object({
          production: fields.array(fields.text({ label: 'รายละเอียด' }), { label: 'ด้านการผลิต (Production)', itemLabel: props => props.value }),
          processing: fields.array(fields.text({ label: 'รายละเอียด' }), { label: 'ด้านการแปรรูป (Processing)', itemLabel: props => props.value }),
          distribution: fields.array(fields.text({ label: 'รายละเอียด' }), { label: 'ด้านการกระจาย (Distribution)', itemLabel: props => props.value }),
        }),
        roles: fields.multiselect({
          label: 'บทบาท',
          options: [
            { label: 'ผู้ผลิต', value: 'producer' },
            { label: 'ผู้จำหน่าย', value: 'distributor' },
            { label: 'ผู้บริโภค', value: 'consumer' },
          ],
          defaultValue: [],
        }),
        images: fields.array(
          fields.image({
            label: 'รูปภาพสถานที่',
            // กำหนดให้เซฟรูปไปไว้ในโฟลเดอร์ public (Astro จะได้ดึงไปโชว์ได้ทันที)
            directory: 'public/images/', 
            publicPath: '/images/',
          }),
          {
            label: 'แกลเลอรีรูปภาพ',
            itemLabel: (props) => props.value ? 'รูปภาพที่อัปโหลดแล้ว 🖼️' : 'รอเพิ่มรูปภาพ...',
          }
        ),
        content: fields.document({
          label: 'รายละเอียดเนื้อหา',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});