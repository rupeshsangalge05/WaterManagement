import express from 'express';
import {
  getAllTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable
} from '../controllers/WaterTimetableController.js';

const WaterTimetableRouter = express.Router();

WaterTimetableRouter.post('/', createTimetable);
WaterTimetableRouter.get('/', getAllTimetables);
WaterTimetableRouter.put('/:id', updateTimetable);
WaterTimetableRouter.delete('/:id', deleteTimetable);

export default WaterTimetableRouter;
