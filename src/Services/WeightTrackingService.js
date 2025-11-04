import { getWeightLogs } from '../api/weightGoalApi';
import { localStorageHelper, StorageKeys } from '../Common/localStorageHelper';
import PhotoStorageService from './PhotoStorageService';

const WEIGHT_DATA_KEY = 'WEIGHT_TRACKING_DATA';
const USER_GOAL_KEY = 'USER_WEIGHT_GOAL';
const USER_STARTING_WEIGHT_KEY = 'USER_STARTING_WEIGHT';

class WeightTrackingService {
    // Get all weight entries
    async getWeightEntries() {
        try {
            const userId = await localStorageHelper.getItemFromStorage(StorageKeys.USER_ID);
            if (!userId) {
                return [];
            }

            const response = await getWeightLogs(userId);
            if (response?.success) {
                return response?.data || [];
            }
            return [];

        } catch (error) {
            console.log('Error getting weight entries:', error);
            return [];
        }
    }

    // Add a new weight entry
    // async addWeightEntry(weightData) {
    //     try {
    //         const entries = await this.getWeightEntries();
    //         let savedPhotos = [];

    //         // Save photos if provided
    //         if (weightData.photos && weightData.photos.length > 0) {
    //             try {
    //                 savedPhotos = await PhotoStorageService.saveMultiplePhotos(weightData.photos);
    //             } catch (photoError) {
    //                 console.log('Error saving photos:', photoError);
    //                 // Continue without photos if photo saving fails
    //             }
    //         }

    //         const newEntry = {
    //             id: Date.now().toString(),
    //             type: 'weight',
    //             weight: weightData.weight,
    //             date: weightData.date,
    //             photos: savedPhotos,
    //             createdAt: new Date().toISOString(),
    //         };

    //         // Calculate weight change if there's a previous entry
    //         if (entries.length > 0) {
    //             const lastEntry = entries[0]; // Most recent entry
    //             const change = weightData.weight - lastEntry.weight;
    //             newEntry.change = change;
    //             newEntry.changeType = change < 0 ? 'loss' : 'gain';
    //         } else {
    //             newEntry.change = 0;
    //             newEntry.changeType = 'neutral';
    //         }

    //         const updatedEntries = [newEntry, ...entries];
    //         await localStorageHelper.setStorageArrayItem({
    //             key: WEIGHT_DATA_KEY,
    //             value: updatedEntries
    //         });

    //         return newEntry;
    //     } catch (error) {
    //         console.log('Error adding weight entry:', error);
    //         throw error;
    //     }
    // }

    // Add a photo entry
    // async addPhotoEntry(photoData) {
    //     try {
    //         const entries = await this.getWeightEntries();
    //         let savedPhoto = null;

    //         // Save photo if provided
    //         if (photoData.image) {
    //             try {
    //                 const savedPhotos = await PhotoStorageService.saveMultiplePhotos([photoData.image]);
    //                 savedPhoto = savedPhotos[0];
    //             } catch (photoError) {
    //                 console.log('Error saving photo:', photoError);
    //                 throw photoError;
    //             }
    //         }

    //         const newEntry = {
    //             id: Date.now().toString(),
    //             type: 'photo',
    //             date: photoData.date,
    //             image: savedPhoto,
    //             createdAt: new Date().toISOString(),
    //         };

    //         const updatedEntries = [newEntry, ...entries];
    //         await localStorageHelper.setStorageArrayItem({
    //             key: WEIGHT_DATA_KEY,
    //             value: updatedEntries
    //         });

    //         return newEntry;
    //     } catch (error) {
    //         console.log('Error adding photo entry:', error);
    //         throw error;
    //     }
    // }

    // Add Goal Weight in the local storage
    // async setGoalWeight(goalWeight) {
    //     try {
    //         await localStorageHelper.setStorageItem({
    //             key: USER_GOAL_KEY,
    //             value: goalWeight
    //         });
    //         return true;
    //     }
    //     catch (error) {
    //         console.log('Error setting goal weight:', error);
    //         throw error;
    //     }
    // }


    // Delete an entry
    // async deleteEntry(entryId) {
    //     try {
    //         const entries = await this.getWeightEntries();
    //         const entryToDelete = entries.find(entry => entry.id === entryId);

    //         if (entryToDelete) {
    //             // Delete associated photos
    //             if (entryToDelete.photos && entryToDelete.photos.length > 0) {
    //                 const photoFileNames = entryToDelete.photos.map(photo => photo.fileName);
    //                 await PhotoStorageService.deleteMultiplePhotos(photoFileNames);
    //             }

    //             if (entryToDelete.type === 'photo' && entryToDelete.image && entryToDelete.image.fileName) {
    //                 await PhotoStorageService.deletePhoto(entryToDelete.image.fileName);
    //             }
    //         }

    //         const updatedEntries = entries.filter(entry => entry.id !== entryId);
    //         await localStorageHelper.setStorageArrayItem({
    //             key: WEIGHT_DATA_KEY,
    //             value: updatedEntries
    //         });
    //         return true;
    //     } catch (error) {
    //         console.log('Error deleting entry:', error);
    //         throw error;
    //     }
    // }

    // Get current weight (most recent entry)
    async getCurrentWeight(weightLogs) {
        try {
            const entries = weightLogs;
            const weightEntries = entries.filter(entry => entry.type === 'weight' || entry.type === 'weightwithphoto');
            return weightEntries.length > 0 ? weightEntries[0].weight : null;
        } catch (error) {
            console.log('Error getting current weight:', error);
            return null;
        }
    }

    // Get starting weight (first entry)
    async getStartingWeight(weightLogs = []) {
        try {
            const entries = weightLogs;
            const weightEntries = entries.filter(entry => entry.type === 'weight' || entry.type === 'weightwithphoto');
            return weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : null;
        } catch (error) {
            console.log('Error getting starting weight:', error);
            return null;
        }
    }

    // Get weight lost
    async getWeightLost(weightLogs = []) {
        try {
            const currentWeight = await this.getCurrentWeight(weightLogs);
            const startingWeight = await this.getStartingWeight(weightLogs);

            if (currentWeight && startingWeight) {
                return startingWeight - currentWeight;
            }
            return 0;
        } catch (error) {
            console.log('Error calculating weight lost:', error);
            return 0;
        }
    }

    // Get weight lost in last N days
    async getWeightLostInDays(days, weightLogs = []) {
        try {
            const entries = weightLogs;
            const weightEntries = entries.filter(entry => entry.type === 'weight' || entry.type === 'weightwithphoto');

            if (weightEntries.length === 0) return 0;

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const recentEntries = weightEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= cutoffDate;
            });

            if (recentEntries.length === 0) return 0;

            const oldestRecentWeight = recentEntries[recentEntries.length - 1].weight;
            const currentWeight = weightEntries[0].weight;

            return oldestRecentWeight - currentWeight;
        } catch (error) {
            console.log('Error calculating weight lost in days:', error);
            return 0;
        }
    }

    // Set user goal weight
    async setGoalWeight(goalWeight, weightLogs = []) {
        try {
            await localStorageHelper.setStorageItem({
                key: USER_GOAL_KEY,
                value: goalWeight.toString()
            });
            return true;
        } catch (error) {
            console.log('Error setting goal weight:', error);
            throw error;
        }
    }

    // Get user goal weight
    async getGoalWeight(goalWeightData) {
        try {
            const goalWeight = goalWeightData?.goal_weight || 0;
            return goalWeight ? parseFloat(goalWeight) : null;
        } catch (error) {
            console.log('Error getting goal weight:', error);
            return null;
        }
    }

    // Get weight entries for chart data
    async getChartData(weightLogs) {
        try {
            const entries = weightLogs;
            const weightEntries = entries.filter(entry => entry.type === 'weight' || entry.type === 'weightwithphoto');

            // Group by date and get the latest entry for each date
            const groupedByDate = weightEntries.reduce((acc, entry) => {
                const date = entry.date;

                // If date doesn't exist or current entry is more recent, update it
                if (!acc[date] || entry.timestamp > acc[date].timestamp) {
                    acc[date] = entry;
                }

                return acc;
            }, {});

            // Convert to array and sort by date (newest first)
            const sortedEntries = Object.values(groupedByDate)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 7) // Get last 7 entries
                .reverse(); // Reverse to show oldest to newest for chart

            return sortedEntries.map(entry => ({
                date: entry.date,
                weight: entry.weight,
                change: entry.change || 0,
                changeType: entry.changeType || 'neutral'
            }));
        } catch (error) {
            console.log('Error getting chart data:', error);
            return [];
        }
    }

    // Get recent photos
    async getRecentPhotos(weightLogs = []) {
        try {
            const photoEntries = weightLogs
                .filter(entry => entry.type === 'photo' || entry.type === 'weightwithphoto')
                .flatMap(entry => entry.photos || []); // Flatten all photos

            // Get last 10 (most recent) photos
            return photoEntries.slice(0, 10);
        } catch (error) {
            console.log('Error getting recent photos:', error);
            return [];
        }
    }

    // Get weight statistics
    async getWeightStatistics(weightLogs, goalWeightData) {
        try {
            const currentWeight = await this.getCurrentWeight(weightLogs);
            const startingWeight = await this.getStartingWeight(weightLogs);
            const goalWeight = await this.getGoalWeight(goalWeightData);
            const weightLost = await this.getWeightLost(weightLogs);
            const weightLost30Days = await this.getWeightLostInDays(30, weightLogs);
            const weightLost90Days = await this.getWeightLostInDays(90, weightLogs);

            return {
                currentWeight: parseInt(currentWeight) || 0,
                startingWeight: parseInt(startingWeight) || 0,
                goalWeight: goalWeight || 0,
                weightLost: weightLost,
                weightLost30Days: weightLost30Days,
                weightLost90Days: weightLost90Days,
            };
        } catch (error) {
            console.log('Error getting weight statistics:', error);
            return {
                currentWeight: 0,
                startingWeight: 0,
                goalWeight: 0,
                weightLost: 0,
                weightLost30Days: 0,
                weightLost90Days: 0,
            };
        }
    }

    // Clear all data (for testing or reset)
    async clearAllData() {
        try {
            await localStorageHelper.removeStorageItems([WEIGHT_DATA_KEY, USER_GOAL_KEY, USER_STARTING_WEIGHT_KEY]);
            return true;
        } catch (error) {
            console.log('Error clearing weight data:', error);
            throw error;
        }
    }
}

export default new WeightTrackingService();
