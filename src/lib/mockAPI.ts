// Mock API for generating random tasks with priority scores

export interface Task {
  name: string;
  priority: number; // Higher number = higher priority
}

const taskPool: Omit<Task, 'priority'>[] = [
  { name: "Complete quarterly report" },
  { name: "Reply to urgent client email" },
  { name: "Prepare presentation slides" },
  { name: "Review team performance" },
  { name: "Update project documentation" },
  { name: "Schedule team meeting" },
  { name: "Fix critical bug in production" },
  { name: "Plan next sprint goals" },
  { name: "Conduct user research" },
  { name: "Optimize database queries" },
  { name: "Create marketing materials" },
  { name: "Train new team member" },
  { name: "Backup important data" },
  { name: "Update security protocols" },
  { name: "Review budget allocation" },
  { name: "Organize office supplies" },
  { name: "Plan company retreat" },
  { name: "Update employee handbook" },
  { name: "Conduct code review" },
  { name: "Design new feature mockups" },
  { name: "Respond to customer feedback" },
  { name: "Negotiate vendor contracts" },
  { name: "Archive old project files" },
  { name: "Set up development environment" },
  { name: "Write technical documentation" },
  { name: "Update website content" },
  { name: "Prepare monthly invoices" },
  { name: "Conduct security audit" },
  { name: "Plan product roadmap" },
  { name: "Organize team building event" }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate priority score based on task characteristics
const generatePriorityScore = (taskName: string): number => {
  let score = 50; // Base score
  
  // Boost priority for urgent/critical tasks
  if (taskName.includes('urgent') || taskName.includes('critical')) score += 30;
  if (taskName.includes('bug') || taskName.includes('security')) score += 25;
  if (taskName.includes('client') || taskName.includes('customer')) score += 20;
  if (taskName.includes('production') || taskName.includes('report')) score += 15;
  
  // Lower priority for administrative tasks
  if (taskName.includes('organize') || taskName.includes('archive')) score -= 15;
  if (taskName.includes('supplies') || taskName.includes('retreat')) score -= 20;
  if (taskName.includes('handbook') || taskName.includes('documentation')) score -= 10;
  
  // Add some randomness (±15 points)
  score += Math.floor(Math.random() * 31) - 15;
  
  // Ensure score is between 10-100
  return Math.max(10, Math.min(100, score));
};

export const mockAPI = {
  async getRandomTasks(): Promise<Task[]> {
    await delay(800); // Simulate API call delay
    
    // Shuffle task pool and select 6 random tasks
    const shuffled = [...taskPool].sort(() => Math.random() - 0.5);
    const selectedTasks = shuffled.slice(0, 6);
    
    // Generate priority scores for selected tasks
    const tasksWithPriority: Task[] = selectedTasks.map(task => ({
      ...task,
      priority: generatePriorityScore(task.name)
    }));
    
    return tasksWithPriority;
  }
};