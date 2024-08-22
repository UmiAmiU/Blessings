import Grid from '@mui/material/Unstable_Grid2';
import { useUnit } from 'effector-react';
import { $session, $sessions, setSession } from '../../store/session';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Backdrop,
  Button,
  CircularProgress,
  keyframes,
  Typography,
} from '@mui/material';
import { $blessings } from '../../store/blessings';
import { ORDER } from '../../utils/consts';
import { Reveal } from 'react-awesome-reveal';
import BlessingCard from '../BlessingCard';

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 300px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const cardAnimationLeft = keyframes`
  from {
    opacity: 0;
    transform: translate3d(-300px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const cardAnimationRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(300px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const Spectator = () => {
  const { spectateId, gameId } = useParams();
  const [player, setPlayer] = useState<boolean | null>(null);
  const [spectator, setSpectator] = useState<boolean>(false);
  const sessions = useUnit($sessions);
  const session = useUnit($session);
  const blessings = useUnit($blessings);
  console.log(session);
  useEffect(() => {
    if (spectateId) {
      const [sessionId, isSpectator] = spectateId.split('&');
      const findSession = sessions.find((elem) => elem.id === sessionId);
      if (findSession) {
        setSession(findSession);
        setPlayer(null);
        if (isSpectator) {
          setSpectator(true);
        }
      }
    } else if (gameId) {
      const [sessionId, playerId] = gameId.split('&');
      const findSession = sessions.find((elem) => elem.id === sessionId);
      if (findSession) {
        const isFirstPlayer = findSession.firstPlayer.id === playerId;
        setSession(findSession);
        setPlayer(isFirstPlayer);
      }
    }
  }, [blessings]);

  return session.id === '' ? (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  ) : session.finished ? (
    <Grid container margin={0} height='100vh' alignItems='flex-start'>
      <Grid container margin={0} xs={12} height='50%' alignContent='center'>
        <Grid
          xs={12}
          height='50px'
          display='flex'
          alignItems='center'
          justifyContent='center'
          marginBottom='15px'
        >
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 900,
            }}
            variant='h5'
          >
            {session ? session.firstPlayer.name : ''}
          </Typography>
        </Grid>
        <Grid
          xs={12}
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{ mixBlendMode: 'color-dodge' }}
          flexDirection='row-reverse'
        >
          <Reveal cascade keyframes={cardAnimationLeft}>
            {session.firstPlayer.selectedBlessings
              .map((blessing) => (
                <BlessingCard
                  key={blessing.id}
                  blessing={blessing}
                  isEnd
                  session={session}
                  spectator={spectator}
                  player={player}
                />
              ))
              .reverse()}
          </Reveal>
        </Grid>
      </Grid>
      <Grid
        container
        margin={0}
        xs={12}
        height='50%'
        alignContent='center'
        sx={{
          borderTop: '1px solid',
          borderImage: 'url(/lineDr.svg) 1',
        }}
      >
        <Grid
          xs={12}
          height='50px'
          display='flex'
          alignItems='center'
          justifyContent='center'
          marginBottom='15px'
        >
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 900,
            }}
            variant='h5'
          >
            {session ? session.secondPlayer.name : ''}
          </Typography>
        </Grid>
        <Grid
          xs={12}
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{ mixBlendMode: 'color-dodge' }}
        >
          <Reveal cascade keyframes={cardAnimationRight}>
            {session.secondPlayer.selectedBlessings.map((blessing) => (
              <BlessingCard
                key={blessing.id}
                blessing={blessing}
                isEnd
                session={session}
                spectator={spectator}
                player={!player}
              />
            ))}
          </Reveal>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Grid container margin={0} height='100vh' alignItems='flex-start'>
      <Grid container xs={12} height='100px'>
        <Grid
          container
          xs={2}
          margin={0}
          spacing={2}
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
          sx={{
            borderRight: '1px solid',
            borderLeft: '1px solid',
            borderImage: 'url(/lineSmall.svg) 1',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 900,
            }}
            variant='h5'
          >
            {session ? session.firstPlayer.name : ''}
          </Typography>
        </Grid>
        <Grid
          container
          xs
          margin={0}
          spacing={2}
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          {player === null && !spectator && (
            <Grid
              container
              xs
              margin={0}
              display='flex'
              justifyContent='center'
              alignItems='center'
            >
              <Button
                variant='outlined'
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/game/${session.id}&${session.firstPlayer.id}`
                  );
                }}
              >
                Player 1
              </Button>
              <Button
                variant='outlined'
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/game/${session.id}&${session.secondPlayer.id}`
                  );
                }}
                sx={{ margin: '0 10px 0 10px' }}
              >
                Player 2
              </Button>
              <Button
                variant='outlined'
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/spectate/${session.id}&true`
                  );
                }}
              >
                Spectator
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid
          container
          xs={2}
          margin={0}
          spacing={2}
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
          sx={{
            borderRight: '1px solid',
            borderLeft: '1px solid',
            borderImage: 'url(/lineSmall.svg) 1',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 900,
            }}
            variant='h5'
          >
            {session ? session.secondPlayer.name : ''}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        xs={2}
        margin={0}
        spacing={2}
        display='flex'
        alignItems='center'
        justifyContent='flex-start'
        flexDirection='column'
        sx={{
          borderRight: '1px solid',
          borderLeft: '1px solid',
          borderImage: 'url(/line.svg) 1',
          mixBlendMode: 'color-dodge',
        }}
        height='980px'
      >
        {session.firstPlayer.selectedBlessings.map((blessing) => (
          <BlessingCard
            key={blessing.id}
            blessing={blessing}
            session={session}
            spectator={spectator}
            player={player}
          />
        ))}
      </Grid>
      <Grid
        container
        xs
        margin={0}
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{ mixBlendMode: 'color-dodge' }}
        height='100%'
      >
        <Reveal cascade keyframes={customAnimation}>
          {player === null ||
          ORDER[session.usedBlessings.length / 3].isFirstPlayer === player ? (
            session.blessingsToSelect.map((blessing) => (
              <BlessingCard
                key={blessing.id}
                blessing={blessing}
                isBig={true}
                session={session}
                spectator={spectator}
                player={player}
              />
            ))
          ) : (
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 900,
              }}
              variant='h5'
            >
              Opponent is selecting
            </Typography>
          )}
        </Reveal>
      </Grid>
      <Grid
        container
        xs={2}
        margin={0}
        spacing={2}
        display='flex'
        alignItems='center'
        justifyContent='flex-start'
        flexDirection='column'
        sx={{
          borderRight: '1px solid',
          borderLeft: '1px solid',
          borderImage: 'url(/line.svg) 1',
          mixBlendMode: 'color-dodge',
        }}
        height='980px'
      >
        {session.secondPlayer.selectedBlessings.map((blessing) => (
          <BlessingCard
            key={blessing.id}
            blessing={blessing}
            session={session}
            spectator={spectator}
            player={!player}
          />
        ))}
      </Grid>
    </Grid>
  );
};
