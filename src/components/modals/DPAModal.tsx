import React, { useState } from 'react';
import { Shield, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCustomer } from '../../hooks/useCustomer';
import { Customer, DPAAttempt } from '../../types';

interface DPAModalProps {
  customer: Customer;
  onSuccess: () => void;
  onClose: () => void;
}

const dpaQuestions = [
  {
    id: 'postcode',
    question: 'What is your postcode?',
    getAnswer: (customer: Customer) => customer.address.postcode
  },
  {
    id: 'phone',
    question: 'What are the last 4 digits of your phone number?',
    getAnswer: (customer: Customer) => customer.phone.slice(-4)
  },
  {
    id: 'email',
    question: 'What email address is associated with your account?',
    getAnswer: (customer: Customer) => customer.email
  }
];

export const DPAModal: React.FC<DPAModalProps> = ({ customer, onSuccess, onClose }) => {
  const { user } = useAuth();
  const { addDpaAttempt } = useCustomer();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showOverride, setShowOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = dpaQuestions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < dpaQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      // Check all answers
      const allCorrect = newAnswers.every((answer, index) => {
        const expectedAnswer = dpaQuestions[index].getAnswer(customer);
        return answer.toLowerCase().trim() === expectedAnswer.toLowerCase().trim();
      });

      if (allCorrect) {
        handleDPAPass();
      } else {
        setShowOverride(true);
      }
    }
  };

  const handleDPAPass = () => {
    const attempt: DPAAttempt = {
      id: Date.now().toString(),
      customerId: customer.id,
      agentId: user?.id || '',
      result: 'pass',
      timestamp: new Date().toISOString()
    };
    
    addDpaAttempt(attempt);
    onSuccess();
  };

  const handleOverride = async () => {
    if (!overrideReason.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const attempt: DPAAttempt = {
      id: Date.now().toString(),
      customerId: customer.id,
      agentId: user?.id || '',
      result: 'override',
      reason: overrideReason,
      timestamp: new Date().toISOString()
    };
    
    addDpaAttempt(attempt);
    setIsSubmitting(false);
    onSuccess();
  };

  const handleFail = () => {
    const attempt: DPAAttempt = {
      id: Date.now().toString(),
      customerId: customer.id,
      agentId: user?.id || '',
      result: 'fail',
      timestamp: new Date().toISOString()
    };
    
    addDpaAttempt(attempt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Customer Verification</h2>
                <p className="text-sm text-gray-600">DPA Check Required</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {!showOverride ? (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-2">Verifying: {customer.name}</p>
                <p className="text-sm text-blue-700">
                  Question {currentQuestionIndex + 1} of {dpaQuestions.length}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {currentQuestion.question}
                </label>
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter answer..."
                  autoFocus
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!currentAnswer.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex < dpaQuestions.length - 1 ? 'Next' : 'Verify'}
                </button>
                <button
                  onClick={() => setShowOverride(true)}
                  className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-colors"
                >
                  Override
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-red-50 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Verification Failed</p>
                  <p className="text-sm text-red-700 mt-1">
                    Customer answers did not match our records. Override required.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Override Reason *
                </label>
                <select
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select reason...</option>
                  <option value="customer_unable_to_self_serve">Customer unable to self-serve</option>
                  <option value="billing_error">Billing error</option>
                  <option value="internal_testing">Internal testing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {overrideReason === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Provide detailed reason..."
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleOverride}
                  disabled={!overrideReason || isSubmitting}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Override & Continue'}
                </button>
                <button
                  onClick={handleFail}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  Block Access
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};