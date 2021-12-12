import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

export const RangeSlider = styled(Slider)(({theme}) => ({
    '& .MuiSlider-thumb' : {
        backgroundColor: '#666666',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
          boxShadow: 'inherit',
        },
        '&:before': {
          display: 'none',
        },
    },
    '& .MuiSlider-rail' : {
        backgroundColor: '#333333',
        opacity: 1
    },
    '& .MuiSlider-track' : {
        color: '#444444'
    }
}));