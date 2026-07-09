export const APP_NAME = 'MnCHub';
export const APP_TAGLINE = 'Your College. Your Resources. One Platform.';
export const APP_DESCRIPTION =
  'The ultimate college resource sharing platform. Share notes, PYQs, placement experiences, and connect with your college community.';

export const BRANCHES = [
  { value: 'MnC', label: 'Mathematics & Computing' },
];

export const SEMESTERS = [
  { value: '1', label: 'Semester 1' },
  { value: '2', label: 'Semester 2' },
  { value: '3', label: 'Semester 3' },
  { value: '4', label: 'Semester 4' },
  { value: '5', label: 'Semester 5' },
  { value: '6', label: 'Semester 6' },
  { value: '7', label: 'Semester 7' },
  { value: '8', label: 'Semester 8' },
];

export const RESOURCE_TYPES = [
  { value: 'notes', label: 'Notes', icon: '📝' },
  { value: 'pyq', label: 'Previous Year Questions', icon: '📋' },
  { value: 'assignment', label: 'Assignments', icon: '📑' },
  { value: 'lab', label: 'Lab Reports', icon: '🔬' },
  { value: 'book', label: 'Books / References', icon: '📚' },
  { value: 'slides', label: 'Lecture Slides', icon: '📊' },
  { value: 'video', label: 'Video Lecture', icon: '🎬' },
  { value: 'syllabus', label: 'Syllabus', icon: '📖' },
  { value: 'other', label: 'Other', icon: '📁' },
];

export const ROLES = {
  STUDENT: 'student',
  SENIOR: 'senior',
  MENTOR: 'mentor',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'downloads', label: 'Most Downloaded' },
];

export const CAREER_PATHS = [
  { id: 'web-dev', title: 'Web Development', icon: '🌐', color: 'from-blue-500 to-cyan-500', description: 'Full-stack web development with modern frameworks' },
  { id: 'app-dev', title: 'App Development', icon: '📱', color: 'from-green-500 to-emerald-500', description: 'Mobile app development for iOS and Android' },
  { id: 'ml', title: 'Machine Learning', icon: '🤖', color: 'from-purple-500 to-violet-500', description: 'ML algorithms, deep learning, and AI' },
  { id: 'data-science', title: 'Data Science', icon: '📊', color: 'from-orange-500 to-amber-500', description: 'Data analysis, visualization, and insights' },
  { id: 'cybersecurity', title: 'Cybersecurity', icon: '🔒', color: 'from-red-500 to-rose-500', description: 'Network security, ethical hacking, and cryptography' },
  { id: 'devops', title: 'DevOps', icon: '⚙️', color: 'from-indigo-500 to-blue-500', description: 'CI/CD, cloud infrastructure, and automation' },
  { id: 'cp', title: 'Competitive Programming', icon: '🏆', color: 'from-yellow-500 to-orange-500', description: 'DSA, algorithms, and competitive coding' },
  { id: 'blockchain', title: 'Blockchain', icon: '⛓️', color: 'from-teal-500 to-cyan-500', description: 'Web3, smart contracts, and DApps' },
];

export const DSA_TOPICS = [
  { id: 'arrays', title: 'Arrays & Hashing', problems: 45, difficulty: 'Easy-Medium' },
  { id: 'strings', title: 'Strings', problems: 35, difficulty: 'Easy-Medium' },
  { id: 'linked-lists', title: 'Linked Lists', problems: 30, difficulty: 'Medium' },
  { id: 'stacks-queues', title: 'Stacks & Queues', problems: 25, difficulty: 'Medium' },
  { id: 'trees', title: 'Trees & BST', problems: 50, difficulty: 'Medium-Hard' },
  { id: 'graphs', title: 'Graphs', problems: 40, difficulty: 'Medium-Hard' },
  { id: 'dp', title: 'Dynamic Programming', problems: 60, difficulty: 'Hard' },
  { id: 'greedy', title: 'Greedy Algorithms', problems: 25, difficulty: 'Medium' },
  { id: 'backtracking', title: 'Backtracking', problems: 20, difficulty: 'Medium-Hard' },
  { id: 'bit-manipulation', title: 'Bit Manipulation', problems: 15, difficulty: 'Medium' },
  { id: 'heap', title: 'Heaps & Priority Queue', problems: 20, difficulty: 'Medium' },
  { id: 'trie', title: 'Tries', problems: 10, difficulty: 'Hard' },
];

export const MARKETPLACE_CATEGORIES = [
  { value: 'books', label: 'Books & Study Material' },
  { value: 'electronics', label: 'Electronics & Gadgets' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'clothing', label: 'Clothing & Merchandise' },
  { value: 'furniture', label: 'Room Furniture' },
  { value: 'sports', label: 'Sports Equipment' },
  { value: 'instruments', label: 'Musical Instruments' },
  { value: 'other', label: 'Other' },
];

export const CONDITIONS = [
  { value: 'new', label: 'Brand New', color: 'text-emerald-400' },
  { value: 'like-new', label: 'Like New', color: 'text-green-400' },
  { value: 'good', label: 'Good', color: 'text-blue-400' },
  { value: 'fair', label: 'Fair', color: 'text-yellow-400' },
  { value: 'poor', label: 'Poor', color: 'text-red-400' },
];

export const NAV_ITEMS = [
  { path: '/resources', label: 'Resources' },
  { path: '/community', label: 'Community' },
  { path: '/placements', label: 'Placements' },
  { path: '/research', label: 'Research' },
  { path: '/college', label: 'College Info' },
  { path: '/marketplace', label: 'Marketplace' },
];

export const STATS = {
  resources: '10K+',
  students: '5K+',
  mentors: '500+',
  projects: '1K+',
};
