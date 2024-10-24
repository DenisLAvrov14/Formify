import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import { Table, Button } from 'react-bootstrap'; // Импортируем Button
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const TemplateResults = () => {
  const { templateId } = useParams<{ templateId: string }>(); // Получаем templateId из параметров URL
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate(); // Инициализируем навигацию

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Запрос к коллекции form_answers, а не forms
        const q = query(collection(db, 'form_answers'), where('templateId', '==', templateId)); 
        const querySnapshot = await getDocs(q);
        const answers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched answers:', answers); // Проверка, что данные идут из form_answers
        setResults(answers);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, [templateId]);

  // Функция для возврата назад
  const handleBack = () => {
    navigate(-1); // Возвращаемся на предыдущую страницу
  };

  return (
    <div>
      <h2>Results for Form {templateId}</h2>
      {results.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Submitted At</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.userId}</td>
                <td>
                  {new Date(
                    result.submittedAt?.seconds * 1000
                  ).toLocaleString()}
                </td>
                <td>{result.answers.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No results available for this form.</p>
      )}
      <Button variant="secondary" onClick={handleBack} className="mt-3">Back</Button> {/* Кнопка Back */}
    </div>
  );
};

export default TemplateResults;
