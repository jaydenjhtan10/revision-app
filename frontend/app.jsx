import { useState } from 'react';

export default function App() {
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');
    
    try {
      const response = await fetch('http://localhost:8000/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Biology',
          topic: 'Osmosis',
          difficulty: 'Higher'
        })
      });
      const data = await response.json();
      setQuestionData(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    // In a real app, you might send this back to the AI to grade.
    // For now, we just reveal the correct answer.
    setFeedback(questionData.correct_answer);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans">
      
      {!questionData && !loading ? (
        <button 
          onClick={fetchQuestion}
          className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg"
        >
          Generate First Question
        </button>
      ) : loading ? (
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-10 w-96 bg-slate-200 rounded-xl mb-4"></div>
          <div className="text-slate-400 font-medium">Generating from syllabus...</div>
        </div>
      ) : (
        <div className="max-w-2xl w-full mx-auto p-8 sm:p-10 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all">
          
          <div className="flex justify-between items-center mb-8">
            <span className="px-4 py-1.5 text-xs font-bold tracking-widest text-indigo-500 uppercase bg-indigo-50 rounded-full">
              {questionData.subject} • {questionData.topic}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              {questionData.marks} Marks
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-10 leading-snug">
            {questionData.question_text}
          </h2>

          <textarea 
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full p-5 text-slate-700 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition-all placeholder:text-slate-300"
            rows="4"
            placeholder="Type your answer here..."
            disabled={feedback !== null}
          ></textarea>

          {feedback ? (
            <div className="mt-6 p-6 bg-green-50 rounded-2xl border border-green-100 text-green-800">
              <h4 className="font-bold mb-2">Mark Scheme Answer:</h4>
              <p>{feedback}</p>
              <button 
                onClick={fetchQuestion}
                className="mt-6 px-6 py-3 bg-white text-green-700 font-semibold rounded-xl shadow-sm border border-green-200 hover:bg-green-50 transition"
              >
                Next Question
              </button>
            </div>
          ) : (
            <button 
              onClick={checkAnswer}
              className="mt-6 w-full py-4 text-white font-semibold tracking-wide bg-slate-900 rounded-2xl hover:bg-slate-800 transition-colors shadow-md shadow-slate-200"
            >
              Check Answer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
