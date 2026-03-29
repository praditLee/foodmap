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
      slugField: 'slug',
      path: 'src/content/networks/*',
      format: { contentField: 'knowledgeSharingContent' },
      columns: ['name', 'province'],
      schema: {
        name: fields.text({ 
          label: 'ชื่อกลุ่ม / สถานที่ (ภาษาไทย)',
          validation: { isRequired: true } 
        }),
        slug: fields.text({
          label: 'รหัสอ้างอิง URL (Slug) **ใช้ภาษาอังกฤษและขีดกลางเท่านั้น**',
          validation: { isRequired: true, length: { min: 1 } },
          description: 'เช่น klong-ree-farm, wat-sanam-chai (ห้ามซ้ำกัน)'
        }),
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
        imageUrl: fields.image({ label: 'รูปภาพหน้าปกเครือข่าย', directory: 'public/images/networks/', publicPath: '/images/networks/' }),
        // 👇 Fields ใหม่ที่คุณต้องการให้แสดงใน Modal 👇
        knowledgeSharingContent: fields.document({
          label: 'การเสริมสร้างองค์ความรู้และรูปแบบการให้บริการอาหารเพื่อสุขภาวะ',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
        // strategicPartnersLocal: fields.text({ label: 'ภาคียุทธศาสตร์นโยบายระดับท้องถิ่น', multiline: true }),
        // partnersLocal: fields.text({ label: 'ภาคียุทธศาสตร์นโยบายระดับท้องถิ่น', multiline: true }),
        // localPolicies: fields.text({ label: 'นโยบายระดับท้องถิ่น', multiline: true }),
        // nationalPartnerPolicies: fields.text({ label: 'ภาคียุทธศาสตร์นโยบายระดับชาติ', multiline: true }),
        // nationalPartners: fields.text({ label: 'ภาคียุทธศาสตร์ระดับชาติ', multiline: true }),
      }
    }),

    // 2. อัปเดตคอลเลกชัน "สถานที่ (Locations)" เดิม
    locations: collection({
      label: 'สถานที่ / กลุ่ม (Locations)',
      slugField: 'slug',
      path: 'src/content/locations/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['name', 'province'], // โชว์ชื่อภาษาไทย และ โชว์จังหวัด
      schema: {
       name: fields.text({ 
          label: 'ชื่อกลุ่ม / สถานที่', 
          validation: { isRequired: true } 
        }),
        slug: fields.text({
          label: 'รหัสอ้างอิง URL (Slug) **ใช้ภาษาอังกฤษและขีดกลางเท่านั้น**',
          validation: { isRequired: true, length: { min: 1 } },
          description: 'เช่น klong-ree-farm, wat-sanam-chai (ห้ามซ้ำกัน)'
        }),
        // 👇 เพิ่ม Field Relationship ตรงนี้
        network: fields.relationship({
          label: 'สังกัดเครือข่าย',
          collection: 'networks',
          description: 'เลือกเครือข่ายที่สถานที่นี้สังกัด (ถ้ามี)'
        }),

        // ใช้เก็บ "ข้อมูล" และ "กิจกรรม/การดำเนินงาน" รวมกันในนี้ได้เลย
        content: fields.document({
          label: 'ข้อมูล และ กิจกรรม/การดำเนินงาน',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),

        // --- พิกัดและที่ตั้ง ---
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
        // 1. ประเภทในห่วงโซ่อาหาร
        supplyChainStage: fields.select({
          label: 'ประเภท (จุดในห่วงโซ่)',
          options: [
            { label: 'ต้นน้ำ (การผลิต)', value: 'upstream' },
            { label: 'กลางน้ำ (ตลาด/แปรรูป)', value: 'midstream' },
            { label: 'ปลายน้ำ (ผู้บริโภค/โรงเรียน)', value: 'downstream' },
            { label: 'หน่วยงานภาคี', value: 'partner' },
          ],
          defaultValue: 'upstream',
        }),

        // 2. ผลผลิต / ผลิตภัณฑ์
  
        productList: fields.array(
          fields.object({
            name: fields.text({ label: 'ชื่อผลผลิต / ผลิตภัณฑ์' }),
            standards: fields.multiselect({
              label: 'มาตรฐาน',
              options: [
                { label: 'PGS', value: 'pgs' },
                { label: 'Organic Thailand', value: 'organic_thailand' },
                { label: 'GAP', value: 'gap' },
                { label: 'OTOP', value: 'fda_otop' },
                { label: 'ทั่วไป / ไม่มีตรารับรอง', value: 'general' },
              ],
              defaultValue: ['general'],
            }),
            // 👇 ต้องเพิ่มโค้ดก้อนนี้เข้าไปครับ ปุ่มถึงจะโผล่ในหน้าแอดมิน 👇
            productImage: fields.image({
              label: 'รูปภาพผลผลิต (ถ้ามี)',
              directory: 'public/images/products/', 
              publicPath: '/images/products/',
            }),
            // 👆👆👆
          }),
          {
            label: 'รายการผลผลิต / ผลิตภัณฑ์',
            itemLabel: props => props.fields.name.value || 'เพิ่มผลผลิตใหม่'
          }
        ),

        // 3. ช่องทางการติดต่อ
        contacts: fields.array(
          fields.object({
            type: fields.select({
              label: 'ประเภทการติดต่อ',
              options: [
                { label: 'เบอร์โทรศัพท์', value: 'phone' },
                { label: 'Facebook / เว็บไซต์', value: 'link' },
                { label: 'Line ID', value: 'line' },
              ],
              defaultValue: 'phone',
            }),
            label: fields.text({ label: 'ชื่อแสดงผล (เช่น เบอร์คุณเอ, แฟนเพจกลุ่ม)' }),
            value: fields.text({ label: 'ข้อมูล (ใส่เบอร์โทรติดกัน หรือ ใส่ URL เต็มๆ ที่มี https://)' }),
          }),
          {
            label: 'ช่องทางการติดต่อ',
            itemLabel: props => `${props.fields.label.value || 'ข้อมูลติดต่อ'} (${props.fields.value.value || ''})`
          }
        ),
        images: fields.array(
          fields.image({
            label: 'รูปภาพสถานที่',
            // กำหนดให้เซฟรูปไปไว้ในโฟลเดอร์ public (Astro จะได้ดึงไปโชว์ได้ทันที)
            directory: 'public/images/locations/', 
            publicPath: '/images/locations/',
          }),
          {
            label: 'แกลเลอรีรูปภาพ',
            itemLabel: (props) => props.value ? 'รูปภาพที่อัปโหลดแล้ว 🖼️' : 'รอเพิ่มรูปภาพ...',
          }
        ),
        
      },
    }),
  },
});