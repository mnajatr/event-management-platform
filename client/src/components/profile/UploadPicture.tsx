'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface Props {
  currentPicture: string | null;
  onUpload: () => void;
}

export default function ProfilePictureUploader({ currentPicture, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      await api.post('/users/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile picture updated!');
      onUpload(); // refetch profile
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Label className="mb-2 block">Change Profile Picture</Label>
      <div className="flex items-center gap-4">
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
}
