import badungDistrict from '@/data/badung-district.json';
import supabase from '@/supabase';
import { NextResponse } from 'next/server';

export async function GET(req:Request) {
  try {
      badungDistrict.features.forEach(async (item: any) => {
      const { data, error } = await supabase.from('badung_districts').insert([
        {
          id: item.id,
          country: item.properties.country,
          province: item.properties.province,
          regency: item.properties.regency,
          village: item.properties.village,
          geometry: item.geometry,
          type: "Feature"
        }
      ]).select()
    })

    return new Response('Insert data success!');
  } catch (err) {
      console.log(err);
  }
} 