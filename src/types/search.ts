export interface IRecentlySearch {
  people?: { itemId?: string; fullName?: string; avatarUrl?: string }[];
  ngos?: { itemId?: string; fullName?: string; avatarUrl?: string }[];
  posts?: { itemId?: string }[];
  fundRaisingPosts?: { itemId?: string | null }[];
  hashtags?: { itemId?: string | null; title?: string | null }[];
}
