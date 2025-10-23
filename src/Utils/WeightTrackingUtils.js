import WeightTrackingService from '../Services/WeightTrackingService';

// Utility functions for weight tracking
export const WeightTrackingUtils = {
    // Initialize with sample data for testing (REMOVED - no longer needed)
    // This function has been removed to prevent automatic sample data loading

    // Calculate BMI
    calculateBMI(weight, height) {
        if (!weight || !height || height <= 0) return null;
        return (weight / (height * height)).toFixed(1);
    },

    // Get weight category based on BMI
    getWeightCategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    },

    // Format weight for display
    formatWeight(weight, unit = 'kg') {
        return `${weight.toFixed(1)} ${unit}`;
    },

    // Format date for display
    formatDate(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    },

    // Get weight change color
    getWeightChangeColor(changeType) {
        switch (changeType) {
            case 'loss':
                return '#4CAF50'; // Green
            case 'gain':
                return '#F44336'; // Red
            default:
                return '#757575'; // Gray
        }
    },

    // Get weight change icon
    getWeightChangeIcon(changeType) {
        switch (changeType) {
            case 'loss':
                return '↓';
            case 'gain':
                return '↑';
            default:
                return '→';
        }
    }
};

export default WeightTrackingUtils;
