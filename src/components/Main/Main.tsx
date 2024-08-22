import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../store/session';
import { Button, TextField } from '@mui/material';
import { emptySession } from '../../types';
import { v4 as uuid } from 'uuid';

export const Main = () => {
  const navigate = useNavigate();
  const [firstPlayer, setFirstPlayer] = useState('');
  const [secondPlayer, setSecondPlayer] = useState('');

  return (
    <Grid
      container
      spacing={2}
      padding={2}
      margin={0}
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Grid>
        <TextField
          label='First Player'
          size='small'
          variant='outlined'
          value={firstPlayer}
          onChange={(event) => {
            setFirstPlayer(event.target.value);
          }}
        />
      </Grid>
      <Grid>
        <TextField
          label='Second Player'
          size='small'
          variant='outlined'
          value={secondPlayer}
          onChange={(event) => {
            setSecondPlayer(event.target.value);
          }}
        />
      </Grid>
      <Grid>
        <Button
          variant='outlined'
          onClick={() => {
            if (firstPlayer !== '' && secondPlayer !== '') {
              const id = uuid();
              const firstPlayerId = uuid();
              const secondPlayerId = uuid();
              setSession({
                ...emptySession,
                id,
                firstPlayer: {
                  id: firstPlayerId,
                  sessionId: id,
                  name: firstPlayer,
                  selectedBlessings: [],
                },
                secondPlayer: {
                  id: secondPlayerId,
                  sessionId: id,
                  name: secondPlayer,
                  selectedBlessings: [],
                },
              });
              navigate(`/spectate/${id}`);
            }
          }}
        >
          Game
        </Button>
      </Grid>
    </Grid>
  );
};
