import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function VotingSystem({ chapterId, initialVotes = 0 }) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(null);

  const handleVote = (isUpvote) => {
    if (userVote === isUpvote) {
      setVotes(votes - (isUpvote ? 1 : -1));
      setUserVote(null);
    } else {
      if (userVote !== null) {
        setVotes(votes + (isUpvote ? 2 : -2));
      } else {
        setVotes(votes + (isUpvote ? 1 : -1));
      }
      setUserVote(isUpvote);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        onClick={() => handleVote(true)}
        variant={userVote === true ? 'contained' : 'outlined'}
        color="success"
        startIcon={<ThumbUpIcon />}
        sx={{ minWidth: 100 }}
      >
        За ({votes > 0 ? `+${votes}` : votes})
      </Button>
      <Button
        onClick={() => handleVote(false)}
        variant={userVote === false ? 'contained' : 'outlined'}
        color="error"
        startIcon={<ThumbDownIcon />}
        sx={{ minWidth: 100 }}
      >
        Против
      </Button>
    </Box>
  );
}

export default VotingSystem;