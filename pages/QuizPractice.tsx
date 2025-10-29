// In shravanisdakve/nex/nex-22e64853143c4b3e0fec478afdb9c7f526785858/pages/QuizPractice.tsx
import React from 'react';
import { PageHeader } from '../components/ui';
import { Brain } from 'lucide-react'; // Or another relevant icon

const QuizPractice: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Brain size={48} className="mx-auto text-rose-400 mb-4" />
      <PageHeader
        title="Quizzes & Practice"
        subtitle="This feature is currently in progress. Check back soon!"
      />
      {/* You could add a button to go back or link somewhere else */}
      {/* <Button onClick={() => window.history.back()} className="mt-6">
        Go Back
      </Button> */}
    </div>
  );
};

export default QuizPractice;