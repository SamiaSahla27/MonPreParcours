import { CompanySubmission, SubmissionStatus } from "./companySubmission";

/**
 * Mock service for company submissions
 * In production, this would be replaced with actual API calls to the backend
 */

// Simulated storage (in production, this would be in a database)
const mockSubmissions: CompanySubmission[] = [];

/**
 * Submit a company application for review
 * @param submission - The company submission data
 * @returns Promise with the created submission including ID
 */
export async function submitCompanyApplication(
  submission: CompanySubmission
): Promise<{ success: boolean; submission: CompanySubmission; message: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In production, this would handle file uploads to cloud storage
  // For each evidence with a file:
  // 1. Upload file to S3/Azure Blob/GCS
  // 2. Get back the public URL or storage key
  // 3. Replace file object with fileUrl in submission
  
  // Example with FormData for multipart upload:
  // const formData = new FormData();
  // formData.append('companyName', submission.companyName);
  // formData.append('website', submission.website);
  // ... other fields
  // submission.evidences.forEach((evidence, idx) => {
  //   if (evidence.file) {
  //     formData.append(`evidence_${idx}_file`, evidence.file);
  //   }
  // });
  // 
  // const response = await fetch('/api/company-submissions', {
  //   method: 'POST',
  //   body: formData // Note: no Content-Type header, browser sets it with boundary
  // });

  // For demo purposes, simulate file upload
  const processedEvidences = submission.evidences.map((evidence) => {
    if (evidence.file) {
      // In production, this would be the actual uploaded file URL
      const mockFileUrl = `https://storage.example.com/submissions/${Date.now()}_${evidence.file.name}`;
      return {
        ...evidence,
        fileUrl: mockFileUrl,
        // Remove the File object as it can't be serialized
        file: undefined,
      };
    }
    return evidence;
  });

  const newSubmission: CompanySubmission = {
    ...submission,
    evidences: processedEvidences,
    id: `submission_${Date.now()}`,
    status: SubmissionStatus.SUBMITTED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockSubmissions.push(newSubmission);

  console.log("✅ Company submission created:", newSubmission);
  console.log("📊 Total submissions:", mockSubmissions.length);
  console.log("📎 Files uploaded:", processedEvidences.filter(e => e.fileUrl).length);

  return {
    success: true,
    submission: newSubmission,
    message: "Votre dossier a été soumis avec succès",
  };
}

/**
 * Get all submissions (admin only in production)
 * @returns Promise with array of submissions
 */
export async function getAllSubmissions(): Promise<CompanySubmission[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production: GET /api/admin/company-submissions
  return [...mockSubmissions];
}

/**
 * Get submission by ID
 * @param id - Submission ID
 * @returns Promise with submission or null
 */
export async function getSubmissionById(
  id: string
): Promise<CompanySubmission | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In production: GET /api/company-submissions/:id
  const submission = mockSubmissions.find((s) => s.id === id);
  return submission || null;
}

/**
 * Update submission status (admin only in production)
 * @param id - Submission ID
 * @param status - New status
 * @param adminNotes - Optional admin notes
 * @returns Promise with updated submission
 */
export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  adminNotes?: string
): Promise<CompanySubmission | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production: PATCH /api/admin/company-submissions/:id
  const submissionIndex = mockSubmissions.findIndex((s) => s.id === id);
  
  if (submissionIndex === -1) return null;

  mockSubmissions[submissionIndex] = {
    ...mockSubmissions[submissionIndex],
    status,
    adminNotes: adminNotes || mockSubmissions[submissionIndex].adminNotes,
    updatedAt: new Date(),
  };

  console.log("✅ Submission updated:", mockSubmissions[submissionIndex]);

  return mockSubmissions[submissionIndex];
}

/**
 * Get statistics about submissions (admin dashboard)
 */
export async function getSubmissionStats(): Promise<{
  total: number;
  byStatus: Record<SubmissionStatus, number>;
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const stats = {
    total: mockSubmissions.length,
    byStatus: {
      [SubmissionStatus.DRAFT]: 0,
      [SubmissionStatus.SUBMITTED]: 0,
      [SubmissionStatus.UNDER_REVIEW]: 0,
      [SubmissionStatus.NEEDS_MORE_INFO]: 0,
      [SubmissionStatus.APPROVED]: 0,
      [SubmissionStatus.REJECTED]: 0,
    },
  };

  mockSubmissions.forEach((submission) => {
    stats.byStatus[submission.status]++;
  });

  return stats;
}

/**
 * Export submission data for backend integration
 * This function shows the expected API structure
 */
export function getAPIStructure() {
  return {
    endpoints: {
      // Public endpoints
      "POST /api/company-submissions": "Submit a company application (multipart/form-data for files)",
      "GET /api/company-submissions/:id": "Get submission details (with token)",
      
      // Admin endpoints (require authentication)
      "GET /api/admin/company-submissions": "List all submissions",
      "GET /api/admin/company-submissions/:id": "Get submission details",
      "PATCH /api/admin/company-submissions/:id": "Update submission status",
      "GET /api/admin/company-submissions/stats": "Get statistics",
      "GET /api/admin/company-submissions/:id/evidence/:evidenceId/file": "Download evidence file",
    },
    dataModel: {
      CompanySubmission: "See companySubmission.ts for full schema",
      SubmissionStatus: "draft | submitted | under_review | needs_more_info | approved | rejected",
    },
    fileUpload: {
      contentType: "multipart/form-data",
      maxFileSize: "10 MB per file",
      allowedFormats: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
      storage: "Files should be stored in cloud storage (AWS S3, Azure Blob, GCS)",
      naming: "Use UUID or timestamp prefix to avoid collisions: {submission_id}_{timestamp}_{original_filename}",
      security: [
        "Validate file MIME type on server",
        "Scan files with antivirus (ClamAV or cloud service)",
        "Generate signed URLs for temporary access",
        "Set proper CORS headers",
      ],
    },
    notes: [
      "File uploads use multipart/form-data encoding",
      "Evidence files stored in cloud with generated URLs",
      "Email notifications sent on status changes",
      "Approved submissions added to public company list",
      "Admin panel needed for reviewing submissions",
      "Download endpoint should verify admin authentication",
    ],
  };
}
