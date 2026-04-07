export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: UploadedImage | null;
  errors: string[] | null;
}

export interface UploadMultipleResponse {
  success: boolean;
  message: string;
  data: {
    uploaded: UploadedImage[];
    failedCount: number;
  } | null;
  errors: string[] | null;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  data: boolean;
  errors: string[] | null;
}
