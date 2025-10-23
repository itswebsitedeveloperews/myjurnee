import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

class PhotoStorageService {
    constructor() {
        this.photosDirectory = Platform.OS === 'ios'
            ? `${RNFS.DocumentDirectoryPath}/WeightTrackingPhotos`
            : `${RNFS.ExternalDirectoryPath}/WeightTrackingPhotos`;

        this.initializeDirectory();
    }

    // Initialize photos directory
    async initializeDirectory() {
        try {
            const exists = await RNFS.exists(this.photosDirectory);
            if (!exists) {
                await RNFS.mkdir(this.photosDirectory);
                console.log('Photos directory created');
            }
        } catch (error) {
            console.log('Error creating photos directory:', error);
        }
    }

    // Save photo from image picker response
    async savePhoto(imagePickerResponse) {
        try {
            if (!imagePickerResponse || !imagePickerResponse.uri) {
                throw new Error('Invalid image data');
            }

            const timestamp = Date.now();
            const fileName = `weight_photo_${timestamp}.jpg`;
            const filePath = `${this.photosDirectory}/${fileName}`;

            // Copy file from temporary location to our directory
            await RNFS.copyFile(imagePickerResponse.uri, filePath);

            return {
                fileName,
                filePath,
                originalUri: imagePickerResponse.uri,
                timestamp,
                size: imagePickerResponse.fileSize || 0,
                width: imagePickerResponse.width || 0,
                height: imagePickerResponse.height || 0
            };
        } catch (error) {
            console.log('Error saving photo:', error);
            throw error;
        }
    }

    // Save multiple photos
    async saveMultiplePhotos(imagePickerResponses) {
        try {
            const savedPhotos = [];

            for (const response of imagePickerResponses) {
                const savedPhoto = await this.savePhoto(response);
                savedPhotos.push(savedPhoto);
            }

            return savedPhotos;
        } catch (error) {
            console.log('Error saving multiple photos:', error);
            throw error;
        }
    }

    // Get photo URI for display
    getPhotoUri(fileName) {
        return `${this.photosDirectory}/${fileName}`;
    }

    // Check if photo exists
    async photoExists(fileName) {
        try {
            const filePath = `${this.photosDirectory}/${fileName}`;
            return await RNFS.exists(filePath);
        } catch (error) {
            console.log('Error checking photo existence:', error);
            return false;
        }
    }

    // Delete photo file
    async deletePhoto(fileName) {
        try {
            const filePath = `${this.photosDirectory}/${fileName}`;
            const exists = await RNFS.exists(filePath);

            if (exists) {
                await RNFS.unlink(filePath);
                console.log('Photo deleted:', fileName);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Error deleting photo:', error);
            throw error;
        }
    }

    // Delete multiple photos
    async deleteMultiplePhotos(fileNames) {
        try {
            const results = [];

            for (const fileName of fileNames) {
                const result = await this.deletePhoto(fileName);
                results.push({ fileName, deleted: result });
            }

            return results;
        } catch (error) {
            console.log('Error deleting multiple photos:', error);
            throw error;
        }
    }

    // Get all photos in directory
    async getAllPhotos() {
        try {
            const files = await RNFS.readDir(this.photosDirectory);
            return files.filter(file =>
                file.name.startsWith('weight_photo_') &&
                file.name.endsWith('.jpg')
            );
        } catch (error) {
            console.log('Error getting all photos:', error);
            return [];
        }
    }

    // Get storage info
    async getStorageInfo() {
        try {
            const files = await this.getAllPhotos();
            let totalSize = 0;

            files.forEach(file => {
                totalSize += file.size || 0;
            });

            return {
                photoCount: files.length,
                totalSize,
                totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
            };
        } catch (error) {
            console.log('Error getting storage info:', error);
            return {
                photoCount: 0,
                totalSize: 0,
                totalSizeMB: '0.00'
            };
        }
    }

    // Clean up old photos (older than specified days)
    async cleanupOldPhotos(daysOld = 365) {
        try {
            const files = await this.getAllPhotos();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const filesToDelete = files.filter(file => {
                const fileDate = new Date(file.mtime);
                return fileDate < cutoffDate;
            });

            const results = [];
            for (const file of filesToDelete) {
                const deleted = await this.deletePhoto(file.name);
                results.push({ fileName: file.name, deleted });
            }

            console.log(`Cleaned up ${results.length} old photos`);
            return results;
        } catch (error) {
            console.log('Error cleaning up old photos:', error);
            throw error;
        }
    }
}

export default new PhotoStorageService();
