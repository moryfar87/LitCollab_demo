import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider
} from '@mui/material';
import StoryTree from './StoryTree.jsx';
import ChapterForm from './ChapterForm.jsx';
import VotingSystem from './VotingSystem.jsx';

function StoryView() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    console.log('StoryView mounted, id:', id);
    
    // TODO: Загрузка истории с сервера
    // Временные данные для тестирования
    const mockStory = {
      id,
      title: "Путешествие в неизведанное",
      author: "Александр Петров",
      description: "Захватывающая история о путешествии через время и пространство...",
      currentChapter: {
        id: 1,
        title: "Начало пути",
        content: "Все началось в один пасмурный день...",
        votes: 10
      }
    };

    const mockTreeData = {
      name: "Начало пути",
      children: [
        {
          name: "Глава 1: Странная находка",
          children: [
            { name: "Изучить находку", votes: 15 },
            { name: "Отнести в полицию", votes: 8 }
          ]
        },
        {
          name: "Глава 2: Встреча",
          children: [
            { name: "Принять предложение", votes: 12 },
            { name: "Отказаться", votes: 5 }
          ]
        }
      ]
    };

    console.log('Setting mock data:', { mockStory, mockTreeData });
    setStory(mockStory);
    setTreeData(mockTreeData);
  }, [id]);

  const handleAddChapter = (chapterData) => {
    console.log('Новая глава:', chapterData);
    setShowChapterForm(false);
  };

  if (!story) {
    return <Typography>Загрузка...</Typography>;
  }

  console.log('Rendering story:', { story, treeData });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          {story.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Автор: {story.author}
        </Typography>
        <Typography paragraph>
          {story.description}
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {story.currentChapter.title}
        </Typography>
        <Typography paragraph>
          {story.currentChapter.content}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <VotingSystem
            chapterId={story.currentChapter.id}
            initialVotes={story.currentChapter.votes}
          />
          <Button
            variant="contained"
            onClick={() => setShowChapterForm(!showChapterForm)}
          >
            {showChapterForm ? 'Отменить' : 'Добавить продолжение'}
          </Button>
        </Box>
      </Paper>

      {showChapterForm && (
        <ChapterForm
          onSubmit={handleAddChapter}
          parentChapterId={story.currentChapter.id}
        />
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Структура истории
        </Typography>
        <Box sx={{ height: '600px', width: '100%' }}>
          {treeData ? (
            <StoryTree data={treeData} onNodeSelect={setSelectedChapter} />
          ) : (
            <Typography>Загрузка структуры истории...</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default StoryView;