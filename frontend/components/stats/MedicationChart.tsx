import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MedicationChart() {
  // Données statiques pour l'historique de prise
  const stats = {
    history: [
      { date: '2023-08-18T00:00:00Z', taken: 3, total: 4 },
      { date: '2023-08-19T00:00:00Z', taken: 2, total: 4 },
      { date: '2023-08-20T00:00:00Z', taken: 4, total: 4 },
      { date: '2023-08-21T00:00:00Z', taken: 1, total: 4 },
      { date: '2023-08-22T00:00:00Z', taken: 3, total: 4 },
      { date: '2023-08-23T00:00:00Z', taken: 4, total: 4 },
      { date: '2023-08-24T00:00:00Z', taken: 2, total: 4 },
    ]
  };

  const maxBarHeight = 100; // hauteur maximale des barres en pixels

  // Calculer la valeur maximale parmi les totaux (pour d'éventuels ajustements futurs)
  const maxValue = useMemo(() => {
    return Math.max(...stats.history.map(day => day.total), 1);
  }, [stats.history]);

  return (
    <View style={styles.card}>
      <View style={styles.innerContainer}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historique de prise</Text>
          <Text style={styles.headerSubtitle}>7 derniers jours</Text>
        </View>

        {/* Graphique */}
        <View style={styles.chartContainer}>
          {stats.history.map((day, index) => {
            const takenHeight = day.total > 0 ? (day.taken / day.total) * maxBarHeight : 0;
            const missedHeight = day.total > 0 ? ((day.total - day.taken) / day.total) * maxBarHeight : 0;
            const percentage = day.total > 0 ? Math.round((day.taken / day.total) * 100) : 0;

            // Formater la date pour l'affichage
            const dayLabel = format(parseISO(day.date), 'EEE', { locale: fr });
            const dayNumber = format(parseISO(day.date), 'd', { locale: fr });

            return (
              <View key={index} style={styles.barContainer}>
                <Text style={styles.barPercentage}>{percentage}%</Text>
                <View style={styles.barWrapper}>
                  {day.total > 0 ? (
                    <View style={styles.barColumn}>
                      <View style={[styles.barTaken, { height: takenHeight }]} />
                      {missedHeight > 0 && (
                        <View style={[styles.barMissed, { height: missedHeight }]} />
                      )}
                    </View>
                  ) : (
                    <View style={styles.emptyBar} />
                  )}
                </View>
                <Text style={styles.barLabel}>{dayLabel}</Text>
                <Text style={styles.barNumber}>{dayNumber}</Text>
              </View>
            );
          })}
        </View>

        {/* Légende */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.legendText}>Pris</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: '#6B7280' }]} />
            <Text style={styles.legendText}>Manqué</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    // Ombre pour iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Elevation pour Android
    elevation: 3,
    margin: 10,
  },
  innerContainer: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130, // 100 pour les barres + espace supplémentaire
    paddingTop: 16,
  },
  barContainer: {
    alignItems: 'center',
    width: 40,
  },
  barPercentage: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  barColumn: {
    width: '100%',
  },
  barTaken: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barMissed: {
    width: '100%',
    backgroundColor: '#6B7280',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  emptyBar: {
    width: '100%',
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#111827',
    marginTop: 4,
  },
  barNumber: {
    fontSize: 10,
    color: '#6B7280',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#6B7280',
  },
});
