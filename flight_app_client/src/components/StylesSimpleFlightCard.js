import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

export const BuyButton = styled(Button)({
  borderRadius: 50,
  marginRight: '20px',
});

export const Date = styled(CardContent)({
  padding: '32px 0 0 0 ',
  '&:last-child': {
    paddingBottom: 10,
  },
});

export const FlightCard = styled(Card)({
  marginBottom: 10,
  position: 'relative',
  borderRadius: 15,
});
export const TitleContainer = styled(CardContent)({
  paddingBottom: 0,
});

export const InfoContainer = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  '&:last-child': {
    paddingBottom: 0,
  },
});

export const Graph = styled(CardContent)({
  maxHeight: '30vh',
  paddingTop: 0,
  paddingBottom: 0,
  width: '80%',
  margin: 'auto',
  '&:last-child': {
    paddingBottom: 0,
  },
});

export const Actions = styled(CardContent)({
  padding: '16px',
});
