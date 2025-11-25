import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

interface Exercise {
  name: string;
  type: string;
  muscle: string;
  difficulty: string;
}

interface LogExerciseModalProps {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSubmit: (data: {
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    notes?: string;
  }) => void;
}

const LogExerciseModal: React.FC<LogExerciseModalProps> = ({
  visible,
  exercise,
  onClose,
  onSubmit,
}) => {
  const { colors } = useTheme();

  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!sets || !reps) {
      return;
    }

    onSubmit({
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: weight ? parseFloat(weight) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSets('3');
    setReps('10');
    setWeight('');
    setDuration('');
    setNotes('');
  };

  const handleClose = () => {
    // Reset form
    setSets('3');
    setReps('10');
    setWeight('');
    setDuration('');
    setNotes('');
    onClose();
  };

  if (!exercise) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Feather name="edit-3" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Log Workout
                </Text>
                <Text
                  style={[styles.exerciseName, { color: colors.textSecondary }]}
                >
                  {exercise.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Sets and Reps Row */}
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Sets *
                </Text>
                <View
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="repeat"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    value={sets}
                    onChangeText={setSets}
                    keyboardType="number-pad"
                    placeholder="3"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.textInput, { color: colors.text }]}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Reps *
                </Text>
                <View
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="hash"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="number-pad"
                    placeholder="10"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.textInput, { color: colors.text }]}
                  />
                </View>
              </View>
            </View>

            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Weight (kg)
              </Text>
              <View
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather
                  name="activity"
                  size={18}
                  color={colors.textSecondary}
                />
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  placeholder="Optional"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.textInput, { color: colors.text }]}
                />
              </View>
            </View>

            {/* Duration */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Duration (minutes)
              </Text>
              <View
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="clock" size={18} color={colors.textSecondary} />
                <TextInput
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                  placeholder="Optional"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.textInput, { color: colors.text }]}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
              <View
                style={[
                  styles.textAreaContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="How did it feel? Any notes..."
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.textArea, { color: colors.text }]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              title="Log Workout"
              onPress={handleSubmit}
              disabled={!sets || !reps}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseName: {
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
  },
  textArea: {
    fontSize: 15,
    minHeight: 80,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
});

export default LogExerciseModal;
