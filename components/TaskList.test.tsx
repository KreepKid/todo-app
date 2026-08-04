import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from './TaskList';

describe('TaskList Component', () => {
  it('should display the titles of the tasks passed to it', () => {
    // 1. Create some fake tasks to pass as props
    const mockTasks = [
      { id: 1, title: 'Buy groceries', description: 'Milk and eggs', dueDate: new Date(), topic: 'Home', status: 'Pending' },
      { id: 2, title: 'Finish homework', description: 'Math assignment', dueDate: new Date(), topic: 'School', status: 'In-Progress' }
    ];

    // 2. Render the component with our fake data
    render(<TaskList tasks={mockTasks} />);

    // 3. Verify the text appears on the screen
    expect(screen.getByText("Buy groceries")).toBeDefined();
  });


  it('should display an overdue alert when the due date is in the past', () => {
    // 1. Create a fake task with a date in the past
    const mockOverdueTasks = [
      { 
        id: 3, 
        title: 'Pay electricity bill', 
        description: 'Due last year', 
        dueDate: new Date("2023-01-01"), 
        topic: 'Home', 
        status: 'Pending' 
      }
    ];

    // 2. Render the component
    render(<TaskList tasks={mockOverdueTasks} />);

    // 3. Verify the overdue indicator appears
    expect(screen.queryAllByText(/overdue/i).length).toBeGreaterThan(0);
  });


  it('should reveal archived tasks when the "Show archived" checkbox is clicked', () => {
    // 1. Create fake tasks: one normal, one archived
    const mockArchiveTasks = [
      { id: 4, title: 'Walk the dog', description: '', dueDate: new Date(), topic: 'Home', status: 'Pending' },
      { id: 5, title: 'Clean the garage', description: '', dueDate: new Date(), topic: 'Home', status: 'Archived' }
    ];

    // 2. Render the component
    render(<TaskList tasks={mockArchiveTasks} />);

    // 3. Find the checkbox and click it
    // ???
    fireEvent.click(screen.getByRole('checkbox', { name: /show archived/i }));

    // 4. Verify the archived task now appears
    expect(screen.getByText("Clean the garage")).toBeDefined();
  });
});