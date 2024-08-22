import { keyframes } from '@emotion/react';
import {
  Grid,
  Card,
  Box,
  CardMedia,
  Typography,
  CardActionArea,
} from '@mui/material';
import Reveal from 'react-awesome-reveal';
import { IBlessing, ISession } from '../../types';
import { ORDER } from '../../utils/consts';
import { addSelectedBlessing } from '../../store/session';

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

export interface BlessingCardProps {
  blessing: IBlessing;
  isBig?: boolean;
  isEnd?: boolean;
  player: boolean | null;
  spectator: boolean;
  session: ISession;
}

export const BlessingCard = ({
  blessing,
  isBig = false,
  isEnd = false,
  player,
  spectator,
  session,
}: BlessingCardProps) => {
  const children = (
    <Grid margin={isEnd ? '0 15px 0 15px' : '5px'}>
      <Card
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backgroundImage: 'none',
        }}
      >
        <CardActionArea
          onClick={() => {
            const isFirstPlayer =
              ORDER[session.usedBlessings.length / 3].isFirstPlayer;
            addSelectedBlessing({
              selected: blessing,
              used: session.blessingsToSelect,
              isFirstPlayer,
            });
          }}
          disabled={spectator || !isBig}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              sx={
                isBig
                  ? { width: 300, height: 485 }
                  : isEnd ? { width: 260, height: 420 } : { width: 185, height: 300 }
              }
              image={`/cards/${
                blessing.duo
                  ? `${blessing.cost}duo.png`
                  : `${blessing.cost}solo.png`
              }`}
            />
            {(player === null || player || isBig) && (
              <Box
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: isBig ? 'space-around' : 'center',
                  top: isBig ? 50 : 0,
                  width: '100%',
                  height: isBig ? '50%' : '80%',
                  color: 'white',
                  padding: '10px',
                  zIndex: 100,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 900,
                    fontSize: isBig ? '32px' : isEnd ? '28px' : '20px',
                  }}
                  variant='h5'
                >
                  {blessing.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    marginTop: '15px',
                    fontSize: isBig ? '20px' : isEnd ? '18px' : '14px',
                  }}
                  variant='body2'
                >
                  {blessing.text}
                </Typography>
              </Box>
            )}
          </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
  return isBig || isEnd ? (
    children
  ) : (
    <Reveal keyframes={customAnimation}>{children}</Reveal>
  );
};
