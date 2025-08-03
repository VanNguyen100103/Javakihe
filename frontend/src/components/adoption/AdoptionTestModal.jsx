import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hook';
import { submitAdoptionTest } from '../../store/asyncAction/adoptionAsyncAction';
import { clearTestResult } from '../../store/slice/adoptionSlice';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaSpinner, FaStar, FaTrophy } from 'react-icons/fa';

const AdoptionTestModal = ({ isOpen, onClose, onTestComplete }) => {
  const dispatch = useAppDispatch();
  const { testResult } = useAppSelector(state => state.adoption);
  const [answers, setAnswers] = useState({
    q1: null, q2: null, q3: null, q4: null, q5: null,
    q6: null, q7: null, q8: null, q9: null, q10: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Debug useEffect
  useEffect(() => {
    console.log('=== AdoptionTestModal testResult from Redux ===', testResult);
    if (testResult && testResult.score !== undefined) {
      setShowResult(true);
    }
  }, [testResult]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAnswers({
        q1: null, q2: null, q3: null, q4: null, q5: null,
        q6: null, q7: null, q8: null, q9: null, q10: null
      });
      setIsSubmitting(false);
      dispatch(clearTestResult());
    }
  }, [isOpen, dispatch]);

  const questions = [
    {
      id: 1,
      question: "Bạn có đủ thời gian để chăm sóc thú cưng hàng ngày không?",
      description: "Thú cưng cần được cho ăn, dọn dẹp, và chơi đùa mỗi ngày."
    },
    {
      id: 2,
      question: "Bạn có thể để thú cưng ở nhà một mình trong 12 tiếng liên tục không?",
      description: "Thú cưng cần được chăm sóc và không nên để một mình quá lâu."
    },
    {
      id: 3,
      question: "Bạn có sẵn sàng chi trả cho việc khám bệnh và tiêm chủng không?",
      description: "Thú cưng cần được khám sức khỏe định kỳ và tiêm chủng."
    },
    {
      id: 4,
      question: "Bạn có không gian sống phù hợp cho thú cưng không?",
      description: "Thú cưng cần không gian để vận động và nghỉ ngơi."
    },
    {
      id: 5,
      question: "Bạn có thể từ bỏ việc đi du lịch để ở nhà với thú cưng không?",
      description: "Thú cưng cần sự ổn định và không nên thay đổi môi trường thường xuyên."
    },
    {
      id: 6,
      question: "Bạn có sẵn sàng dọn dẹp sau thú cưng không?",
      description: "Thú cưng có thể gây bẩn và cần được dọn dẹp thường xuyên."
    },
    {
      id: 7,
      question: "Bạn có thể cho thú cưng ăn thức ăn rẻ tiền để tiết kiệm không?",
      description: "Thú cưng cần thức ăn chất lượng để khỏe mạnh."
    },
    {
      id: 8,
      question: "Bạn có thể cam kết chăm sóc thú cưng trong 10-15 năm không?",
      description: "Thú cưng có tuổi thọ dài và cần sự cam kết lâu dài."
    },
    {
      id: 9,
      question: "Bạn có thể bỏ qua việc trang trí nhà để thú cưng thoải mái không?",
      description: "Thú cưng có thể làm hỏng đồ đạc và cần không gian riêng."
    },
    {
      id: 10,
      question: "Bạn có sẵn sàng học cách chăm sóc thú cưng đúng cách không?",
      description: "Chăm sóc thú cưng cần kiến thức và kỹ năng."
    }
  ];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`q${questionId}`]: answer
    }));
  };

  const handleSubmit = async () => {
    // Kiểm tra đã trả lời đủ câu hỏi
    const answeredCount = Object.values(answers).filter(answer => answer !== null).length;
    if (answeredCount < 10) {
      toast.error('Vui lòng trả lời đầy đủ tất cả câu hỏi!');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('=== Submitting test answers ===', answers);
      const result = await dispatch(submitAdoptionTest(answers)).unwrap();
      console.log('=== Test result received ===', result);
      
      // Kiểm tra result có hợp lệ không
      if (result && typeof result.score === 'number') {
        toast.success(`Bài test hoàn thành! Điểm của bạn: ${result.score}/100`);
      } else {
        console.error('Invalid result format:', result);
        toast.error('Kết quả bài test không hợp lệ!');
      }
    } catch (error) {
      console.error('=== Test submission error ===', error);
      toast.error(error || 'Gửi bài test thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (testResult) {
      onTestComplete(testResult);
      onClose();
    }
  };

  const handleRetake = () => {
    setAnswers({
      q1: null, q2: null, q3: null, q4: null, q5: null,
      q6: null, q7: null, q8: null, q9: null, q10: null
    });
    setShowResult(false);
    dispatch(clearTestResult());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {!showResult ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Bài Test Nhận Nuôi</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Hãy trả lời 10 câu hỏi để đánh giá khả năng chăm sóc thú cưng của bạn.
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Câu {q.id}: {q.question}
                      </h3>
                      <p className="text-sm text-gray-600">{q.description}</p>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleAnswerChange(q.id, true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300 ${
                          answers[`q${q.id}`] === true
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                        }`}
                      >
                        <FaCheck size={16} />
                        Đúng
                      </button>
                      <button
                        onClick={() => handleAnswerChange(q.id, false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300 ${
                          answers[`q${q.id}`] === false
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                        }`}
                      >
                        <FaTimes size={16} />
                        Sai
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi bài test'
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          // Kết quả bài test
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                {testResult.score >= 70 ? (
                  <FaTrophy className="text-4xl text-green-600" />
                ) : (
                  <FaStar className="text-4xl text-yellow-500" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {testResult.score >= 70 ? 'Chúc mừng!' : 'Cần cải thiện'}
              </h2>
              <p className="text-lg text-gray-600">
                {testResult.score >= 70 
                  ? 'Bạn đã đủ điều kiện để nhận nuôi thú cưng!' 
                  : 'Bạn cần cải thiện thêm để đủ điều kiện nhận nuôi.'
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">
                  {testResult.score}/100
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {testResult.score >= 90 ? 'Xuất sắc' :
                   testResult.score >= 80 ? 'Tốt' :
                   testResult.score >= 70 ? 'Đạt' :
                   testResult.score >= 60 ? 'Trung bình' : 'Cần cải thiện'}
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      testResult.score >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${testResult.score}%` }}
                  ></div>
                </div>

                <div className="text-sm text-gray-600">
                  {testResult.score >= 70 
                    ? 'Bạn có thể tiến hành nhận nuôi thú cưng'
                    : 'Bạn cần đạt ít nhất 70 điểm để nhận nuôi'
                  }
                </div>
              </div>
            </div>

            {testResult.user && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Thông tin của bạn:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Tên:</strong> {testResult.user.fullName}</p>
                  <p><strong>Email:</strong> {testResult.user.email}</p>
                  <p><strong>Số điện thoại:</strong> {testResult.user.phone}</p>
                  <p><strong>Địa chỉ:</strong> {testResult.user.address}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              {testResult.score < 70 && (
                <button
                  onClick={handleRetake}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Làm lại bài test
                </button>
              )}
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-300"
              >
                {testResult.score >= 70 ? 'Tiến hành nhận nuôi' : 'Đóng'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionTestModal; 
