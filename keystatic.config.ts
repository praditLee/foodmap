// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    locations: collection({
      label: 'สถานที่ (Locations)',
      slugField: 'name',
      path: 'src/content/locations/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'ชื่อสถานที่' } }),
        coordinates: fields.object({
          lat: fields.number({ label: 'Latitude' }),
          lng: fields.number({ label: 'Longitude' }),
        }),
        province: fields.select({
          label: 'จังหวัด',
          options: [
            { label: 'ขัยนาท', value: 'chainat' },
            { label: 'เชียงราย', value: 'chiangrai' },
            { label: 'แม่ฮ่องสอน', value: 'maehongson' },
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