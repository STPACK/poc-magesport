import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Storage } from '@google-cloud/storage';
import { format } from 'date-fns';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

const storage = new Storage({
  projectId: 'your-project-id',
  keyFilename: 'path-to-your-service-account.json',
});

const bucketName = 'your-bucket-name';

type FileData = {
  fileName: string;
  fileUrl: string;
  uploadDate: string;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length || !files.every(file => file.type === 'application/pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const fileUploadPromises = files.map(async (file) => {
      const fileName = file.name;
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: 'application/pdf',
      });

      // Upload the file to Cloud Storage
      await new Promise((resolve, reject) => {
        const readableStream = Readable.fromWeb(file.stream() as any);
        readableStream.pipe(blobStream)
          .on('error', reject)
          .on('finish', resolve);
      });

      const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      const uploadDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

      const fileData: FileData = { fileName, fileUrl, uploadDate };
      await addDoc(collection(db, 'uploadedFiles'), fileData);

      return fileData;
    });

    const uploadedFiles = await Promise.all(fileUploadPromises);

    return NextResponse.json({ message: 'Files uploaded successfully', uploadedFiles }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
