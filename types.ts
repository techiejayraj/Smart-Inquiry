
export interface User {
  id: string;
  email: string;
  fullName: string;
  isVerified: boolean;
}

export interface InquiryData {
  id: string;
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  emailId: string;
  inquiryRequirements: string;
  designation: string;
  website: string;
  corporateAddress: string;
  factoryAddress: string;
  telephoneNumber: string;
  timestamp: number;
}

export type ExtractionStatus = 'idle' | 'capturing' | 'extracting' | 'success' | 'error';
export type AuthView = 'login' | 'signup' | 'verify';
