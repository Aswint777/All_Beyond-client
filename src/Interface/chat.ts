export interface Message {
    id: string;
    chatGroupId: string;
    senderId: string;
    content: string;
    fileUrl?: string;
    createdAt: string;
  }
  
  export interface ChatGroup {
    id: string;
    courseId: string;
    adminId: string;
    members: string[];
    courseTitle?: string; 
  }