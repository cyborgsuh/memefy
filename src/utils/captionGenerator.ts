import { CaptionTemplate } from '../types';

const captionTemplates: CaptionTemplate[] = [
  // Corporate humor
  {
    topText: "WHEN YOU'RE THE BOSS",
    bottomText: "BUT STILL CAN'T FIX THE PRINTER",
    category: 'corporate'
  },
  {
    topText: "COMPANY VALUES:",
    bottomText: "WORK-LIFE BALANCE NOT INCLUDED",
    category: 'corporate'
  },
  {
    topText: "WE'RE A FAMILY HERE",
    bottomText: "THANKSGIVING DINNER OPTIONAL",
    category: 'corporate'
  },
  {
    topText: "SYNERGY ACHIEVED",
    bottomText: "NOBODY KNOWS WHAT IT MEANS",
    category: 'corporate'
  },
  {
    topText: "HIRING ISN'T EASY",
    bottomText: "BUT FIRE IS EASY",
    category: 'corporate'
  },
  
  // Startup humor
  {
    topText: "DISRUPTING THE MARKET",
    bottomText: "ONE BUG AT A TIME",
    category: 'startup'
  },
  {
    topText: "MOVE FAST AND BREAK THINGS",
    bottomText: "MISSION ACCOMPLISHED",
    category: 'startup'
  },
  {
    topText: "PIVOT! PIVOT! PIVOT!",
    bottomText: "STILL LOST",
    category: 'startup'
  },
  {
    topText: "UNICORN STATUS",
    bottomText: "MYTHICAL AND OVERVALUED",
    category: 'startup'
  },
  {
    topText: "RAISING FUNDS",
    bottomText: "DOESN'T MEAN YOU'RE DOING ANYTHING",
    category: 'startup'
  },
  {
    topText: "WE'RE BUILDING THE FUTURE",
    bottomText: "ONE BUG AT A TIME",
    category: 'startup'
  },
  
  // Tech humor
  {
    topText: "IT WORKS ON MY MACHINE",
    bottomText: "FAMOUS LAST WORDS",
    category: 'tech'
  },
  {
    topText: "ARTIFICIAL INTELLIGENCE",
    bottomText: "ARTIFICIALLY INTELLIGENT",
    category: 'tech'
  },
  {
    topText: "CLOUD COMPUTING",
    bottomText: "SOMEONE ELSE'S COMPUTER",
    category: 'tech'
  },
  {
    topText: "BLOCKCHAIN EVERYTHING",
    bottomText: "PROBLEM SOLVED?",
    category: 'tech'
  },
  {
    topText: "AI ASSISTANT",
    bottomText: "DOESN'T DO ANYTHING",
    category: 'tech'
  },
  {
    topText: "SOFTWARE DEVELOPMENT",
    bottomText: "MAY THE SOURCE BE WITH YOU",
    category: 'tech'
  },
  
  // Generic business humor
  {
    topText: "QUARTERLY RESULTS",
    bottomText: "EXCEEDED EXPECTATIONS (BARELY)",
    category: 'generic'
  },
  {
    topText: "CUSTOMER SERVICE",
    bottomText: "PLEASE HOLD... FOREVER",
    category: 'generic'
  },
  {
    topText: "BRAND NEW STRATEGY",
    bottomText: "SAME AS THE OLD STRATEGY",
    category: 'generic'
  },
  {
    topText: "INNOVATION AT ITS FINEST",
    bottomText: "CTRL+C, CTRL+V",
    category: 'generic'
  },
  {
    topText: "GOING VIRAL",
    bottomText: "LIKE A COMPUTER VIRUS",
    category: 'generic'
  },
  {
    topText: "MARKET LEADER",
    bottomText: "IN A MARKET OF ONE",
    category: 'generic'
  },
  {
    topText: "CUSTOMER SATISFACTION",
    bottomText: "RESULTS MAY VARY",
    category: 'generic'
  },
  {
    topText: "THINKING OUTSIDE THE BOX",
    bottomText: "BOX SOLD SEPARATELY",
    category: 'generic'
  },
  {
    topText: "BEST PRACTICES",
    bottomText: "PRACTICED BY THE BEST",
    category: 'generic'
  },
  {
    topText: "SCALABLE SOLUTION",
    bottomText: "SCALING DOWN INCLUDED",
    category: 'generic'
  },
  {
    topText: "INNOVATION AT ITS FINEST",
    bottomText: "CTRL+C, CTRL+V",
    category: 'generic'
  },
  {
    topText: "COMPANY VALUES:",
    bottomText: "WORK-LIFE BALANCE SOLD SEPARATELY",
    category: 'corporate'
  },
  {
    topText: "HIRING ISN'T EASY",
    bottomText: "BUT FIRING FEELS GREAT",
    category: 'corporate'
  },
  {
    topText: "MOVE FAST AND BREAK THINGS",
    bottomText: "NOW WE HAVE MORE THINGS TO FIX",
    category: 'startup'
  },
    {
    topText: "PIVOT! PIVOT! PIVOT!",
    bottomText: "STILL HEADING NOWHERE",
    category: 'startup'
  },
    {
    topText: "UNICORN STATUS",
    bottomText: "MYTHICAL, MAGICAL, OVERVALUED",
    category: 'startup'
  },
    {
    topText: "RAISING FUNDS",
    bottomText: "DOESN'T MEAN YOU HAVE A PRODUCT",
    category: 'startup'
  },
    {
    topText: "WE'RE BUILDING THE FUTURE",
    bottomText: "CURRENTLY CRASHING IN BETA",
    category: 'startup'
  },
    {
    topText: "ARTIFICIAL INTELLIGENCE",
    bottomText: "STILL DOESN'T UNDERSTAND HUMOR",
    category: 'tech'
  },
    {
    topText: "QUARTERLY RESULTS",
    bottomText: "BEAT EXPECTATIONS BY 0.01%",
    category: 'generic'
  },
    {
    topText: "CUSTOMER SERVICE",
    bottomText: "PLEASE HOLD FOREVER AND ENJOY THE MUSIC",
    category: 'generic'
  },
  {    
    topText: "BRAND NEW STRATEGY",
    bottomText: "EXACTLY LIKE THE OLD ONE",
    category: 'generic'
  },
    {
    topText: "BEST PRACTICES",
    bottomText: "AS RECOMMENDED BY PEOPLE WHO DON'T DO IT",
    category: 'generic'
  },
  
  
];

export const generateCaptions = (): CaptionTemplate[] => {
  // Shuffle the templates to provide variety
  const shuffled = [...captionTemplates].sort(() => Math.random() - 0.5);
  
  // Return a mix of categories
  const result: CaptionTemplate[] = [];
  const categoriesUsed = new Set<string>();
  
  // Ensure we have variety across categories
  for (const template of shuffled) {
    if (result.length >= 10) break;
    
    // Prefer templates from categories we haven't used much
    if (categoriesUsed.size < 4 && !categoriesUsed.has(template.category)) {
      result.push(template);
      categoriesUsed.add(template.category);
    } else if (result.length < 6) {
      result.push(template);
    }
  }
  
  // Fill remaining slots if needed
  while (result.length < 8 && result.length < shuffled.length) {
    const remaining = shuffled.filter(t => !result.includes(t));
    if (remaining.length === 0) break;
    result.push(remaining[0]);
  }
  
  return result;
};