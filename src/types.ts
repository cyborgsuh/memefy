export interface MemeData {
  id: string;
  imageUrl: string;
  topText: string;
  bottomText: string;
  style: 'classic' | 'modern' | 'bold';
}

export interface CaptionTemplate {
  topText: string;
  bottomText: string;
  category: 'corporate' | 'startup' | 'tech' | 'generic';
}