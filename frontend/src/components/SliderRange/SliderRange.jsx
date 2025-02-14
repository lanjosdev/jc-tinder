import * as Slider from "@radix-ui/react-slider";
import PropTypes from "prop-types";

// Estilo:
import "./sliderrange.css";


SliderRange.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    ageRange: PropTypes.array,
    setAgeRange: PropTypes.func
}
export function SliderRange({ min=18, max=100, ageRange, setAgeRange }) {
	

	return (
		<div className="SliderRange">
            <Slider.Root 
            className="SliderRoot" 
            value={ageRange}
            onValueChange={setAgeRange}
            min={min}
            max={max}
            step={1}
            >
                <Slider.Track className="SliderTrack">
                    <Slider.Range className="SliderRange" />
                </Slider.Track>

                <Slider.Thumb 
                className="SliderThumb" 
                aria-label="Minimum age"
                >
                    {ageRange[0]}
                </Slider.Thumb>

                <Slider.Thumb 
                className="SliderThumb" 
                aria-label="Maximum age"
                >
                    {ageRange[1]}
                </Slider.Thumb>
            </Slider.Root>
        </div>
	);
};