
export interface BaseContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
}

export interface PersonContact extends BaseContact {
  status: 'online' | 'away' | 'offline';
}

export interface GroupContact extends BaseContact {
  members?: number;
}

export type ContactType = PersonContact | GroupContact;

// Message type for chat usage
export interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}
