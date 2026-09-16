import { Card, CardContent, Typography, Box } from '@mui/material';

function StoryNode({ chapter, onSelect }) {
  return (
    <Card
      onClick={() => onSelect(chapter)}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Typography variant="h6">
          {chapter.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Автор: {chapter.author}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            Голоса: {chapter.votes}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StoryNode;