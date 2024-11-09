// api/uploadLessorPic.js
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../config/supabaseClient';
import sql from '../../../config/db';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const storageBucket = 'lessor_image'; // Bucket name for lessor images
    const lessorId = formData.get('lessorId'); // ID to link the file to a specific lessor
    const oldImagePath = formData.get('oldImagePath'); // Path of the old image to be deleted

    if (!file || !lessorId) {
      return new Response(JSON.stringify({ error: 'File and lessor ID are required' }), { status: 400 });
    }

    // Step 1: Delete the old image if `oldImagePath` is provided
    if (oldImagePath) {
      const { error: deleteError } = await supabase
        .storage
        .from(storageBucket)
        .remove([oldImagePath]);

      if (deleteError) {
        console.error('Error deleting old image:', deleteError);
        return new Response(JSON.stringify({ error: 'Error deleting old image' }), { status: 500 });
      }
    }

    // Step 2: Upload the new file
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`; // Generate unique file name
    const { data, error: uploadError } = await supabase
      .storage
      .from(storageBucket)
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return new Response(JSON.stringify({ error: 'Error uploading file' }), { status: 500 });
    }

    // Step 3: Generate public URL for the uploaded file
    const { data: urlData, error: urlError } = supabase
      .storage
      .from(storageBucket)
      .getPublicUrl(fileName);

    if (urlError) {
      console.error('Error generating public URL:', urlError);
      return new Response(JSON.stringify({ error: 'Failed to generate public URL' }), { status: 500 });
    }

    const publicUrl = urlData.publicUrl;

    // Step 4: Update the database with the new image URL
    const updateResult = await sql`
      UPDATE lessor
      SET lessor_profile_pic = ${publicUrl}
      WHERE lessor_id = ${lessorId}
      RETURNING lessor_id
    `;

    if (updateResult.length === 0) {
      throw new Error('Failed to update file metadata in the database');
    }

    return new Response(JSON.stringify({ publicUrl, lessorId: updateResult[0].lessor_id }), {
      status: 200
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error uploading file or saving metadata' }), {
      status: 500
    });
  }
}
