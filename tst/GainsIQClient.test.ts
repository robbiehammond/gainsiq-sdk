// GainsIQClient.test.ts
import { GainsIQClient } from "../src"
import { AddSetRequest } from "../src";

// Mock the global fetch function
global.fetch = jest.fn();

describe("GainsIQClient", () => {
  const apiUrl = "https://api.example.com";
  let client: GainsIQClient;

  beforeEach(() => {
    client = new GainsIQClient(apiUrl);
    (fetch as jest.Mock).mockClear();
  });

  // === Exercises endpoints ===
  describe("Exercises endpoints", () => {
    it("should get exercises", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ["Pushdowns", "Incline DB Curls"],
      });

      const exercises = await client.getExercises();
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/exercises`,
        expect.objectContaining({ method: "GET" })
      );
      expect(exercises).toEqual(["Pushdowns", "Incline DB Curls"]);
    });

    it("should add an exercise", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const response = await client.addExercise("Overhead Press");
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/exercises`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ exercise_name: "Overhead Press" }),
        })
      );
      expect(response).toEqual({ success: true });
    });

    it("should delete an exercise", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Exercise Bench Press deleted successfully",
        }),
      });
    });
  });

  // === Sets endpoints ===
  describe("Sets endpoints", () => {
    it("should log a workout set", async () => {
      const setData = {
        exercise: "Bench Press",
        reps: "10",
        setNumber: 3,
        weight: 225.0,
      };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const response = await client.logWorkoutSet(setData);
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/sets/log`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(setData),
        })
      );
      expect(response).toEqual({ success: true });
    });

    it("should pop the last set", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Successfully deleted last set for Bench Press",
        }),
      });

      const response = await client.popLastSet();
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/sets/pop`,
        expect.objectContaining({ method: "POST" })
      );
      expect(response).toEqual({
        message: "Successfully deleted last set for Bench Press",
      });
    });

    it("should get last month workouts", async () => {
      const dummyWorkout = {
        workoutId: "123e4567-e89b-12d3-a456-426614174000",
        exercise: "Bench Press",
        reps: "10",
        sets: "3",
        weight: "225.0",
        timestamp: "1698787200",
      };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [dummyWorkout],
      });

      const workouts = await client.getLastMonthWorkouts();
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/sets/last_month`,
        expect.objectContaining({ method: "GET" })
      );
      expect(workouts).toEqual([dummyWorkout]);
    });

    it("should edit a set", async () => {
      const payload = {
        workoutId: "123e4567-e89b-12d3-a456-426614174000",
        exercise: "Bench press",
        timestamp: 1698787200,
        reps: "12",
        setNumber: 4,
        weight: 230.0,
      };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const response = await client.editSet(payload);
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/sets/edit`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(payload),
        })
      );
      expect(response).toEqual({ success: true });
    });

    it("should delete a set", async () => {
      const payload = { workoutId: "123e4567-e89b-12d3-a456-426614174000", timestamp: 1698787200 };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const response = await client.deleteSet(payload);
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/sets`,
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify(payload),
        })
      );
      expect(response).toEqual({ success: true });
    });

    it("should get sets by exercise", async () => {
      const params = { exerciseName: "Bench Press", start: 1600000000, end: 1700000000 };
      const dummyWorkout = {
        workoutId: "123e4567-e89b-12d3-a456-426614174000",
        exercise: "Bench Press",
        reps: "10",
        sets: "3",
        weight: "225.0",
        timestamp: "1698787200",
      };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [dummyWorkout],
      });

      const sets = await client.getSetsByExercise(params);
      const expectedUrl = `${apiUrl}/sets/by_exercise?exerciseName=Bench+Press&start=1600000000&end=1700000000`;
      expect(fetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({ method: "GET" })
      );
      expect(sets).toEqual([dummyWorkout]);
    });
  });

  // === Weight endpoints ===
  describe("Weight endpoints", () => {
    it("should get weights", async () => {
      const dummyWeights = [{ weight: 175.5, timestamp: "1698787200" }];
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => dummyWeights,
      });

      const weights = await client.getWeights();
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/weight`,
        expect.objectContaining({ method: "GET" })
      );
      expect(weights).toEqual(dummyWeights);
    });

    it("should log a weight", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const response = await client.logWeight(175.5);
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/weight`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ weight: 175.5 }),
        })
      );
      expect(response).toEqual({ success: true });
    });

    it("should delete most recent weight", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "Most recent weight deleted successfully",
        }),
      });

      const response = await client.deleteMostRecentWeight();
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/weight`,
        expect.objectContaining({ method: "DELETE" })
      );
      expect(response).toEqual({
        message: "Most recent weight deleted successfully",
      });
    });
  });

  // === Analysis endpoint ===
  describe("Analysis endpoint", () => {
    it("should generate analysis", async () => {
      const dummyAnalysis = { summary: "Analysis summary" };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => dummyAnalysis,
      });

      const analysis = await client.generateAnalysis();
      expect(fetch).toHaveBeenCalledWith(
        `${apiUrl}/analysis`,
        expect.objectContaining({ method: "POST" })
      );
      expect(analysis).toEqual(dummyAnalysis);
    });
  });
});