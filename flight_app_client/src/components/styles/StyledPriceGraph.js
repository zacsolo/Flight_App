import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  graphWrapper: { position: 'relative', height: 150, borderRadius: 15 },
  originalPriceText: {
    position: 'absolute',
    top: (cheaper) => cheaper && '10%',
    bottom: (cheaper) => !cheaper && '10%',
    left: '10%',
  },

  newPriceText: {
    position: 'absolute',
    bottom: (cheaper) => cheaper && '10%',
    top: (cheaper) => !cheaper && '10%',
    right: '10%',
  },
  trendLine: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  graphIcon: { fontSize: 60 },
});
