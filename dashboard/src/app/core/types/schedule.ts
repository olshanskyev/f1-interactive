export interface Session {
    kind: string;
    start: string;
    end: string;
}

export interface Round {
   name: string;
   location?: string;
   countryName: string;
   start: string;
   end: string;
   sessions: Session[];
}