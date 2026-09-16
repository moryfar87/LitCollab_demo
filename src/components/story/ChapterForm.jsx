import { useState } from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';

function ChapterForm({ onSubmit, parentChapterId }) {
  const [chapterData, setChapterData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...chapterData, parentChapterId });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Заголовок главы"
          margin="normal"
          value={chapterData.title}
          onChange={(e) => setChapterData({ ...chapterData, title: e.target.value })}
        />
        <TextField
          fullWidth
          label="Содержание"
          multiline
          rows={4}
          margin="normal"
          value={chapterData.content}
          onChange={(e) => setChapterData({ ...chapterData, content: e.target.value })}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Добавить главу
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default ChapterForm;