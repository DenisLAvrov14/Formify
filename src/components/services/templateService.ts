import { Template } from '../../models/Template';
import { db } from '../services/firebase'; // Импортируй и настрой Firebase
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

// Функция для получения всех шаблонов
export const getTemplates = async (): Promise<Template[]> => {
  const templatesCollection = collection(db, 'templates');
  const templatesSnapshot = await getDocs(templatesCollection);
  const templatesList = templatesSnapshot.docs.map((doc) => {
    const data = doc.data(); 

    return {
      id: doc.id, // ID документа из Firestore
      title: data.title || 'Untitled', // Извлекаем title, если его нет — используем значение по умолчанию
      description: data.description || 'No description', // То же самое для description
      questions: data.questions || [], // Массив вопросов, если их нет, оставляем пустой массив
    } as Template; // Приводим объект к типу Template
  });

  return templatesList;
};

// Функция для получения шаблона по ID
export const getTemplateById = async (id: string): Promise<Template | null> => {
  const templateDoc = doc(db, 'templates', id);
  const templateSnapshot = await getDoc(templateDoc);

  if (templateSnapshot.exists()) {
    const data = templateSnapshot.data();
    return {
      id: templateSnapshot.id, // ID документа из Firestore
      title: data.title || 'Untitled', // Извлекаем title
      description: data.description || 'No description', // Извлекаем description
      questions: data.questions || [], // Массив вопросов
    } as Template;
  } else {
    console.error(`Template with ID ${id} not found`);
    return null; // Ошибка если документ с указанным ID не найден
  }
};

// Функция для создания нового шаблона
export const createTemplate = async (template: Template) => {
  try {
    await addDoc(collection(db, 'templates'), template);
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

// Функция для обновления существующего шаблона
export const updateTemplate = async (
  id: string,
  template: Template
): Promise<void> => {
  const templateDoc = doc(db, 'templates', id);
  await updateDoc(templateDoc, template);
};

// Функция для удаления шаблона
export const deleteTemplate = async (id: string): Promise<void> => {
  const templateDoc = doc(db, 'templates', id);
  await deleteDoc(templateDoc);
};
