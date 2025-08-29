export const cleanString = (s: string) => {
  return s.replace(/[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}a-zA-Z0-9\s]/gu, '');
}

