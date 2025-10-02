import React from "react";
import { ScrollView, Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import ChipButton from "@/components/ui/ChipButton";
import departements from "@/assets/data/departement.json";
import category from "@/assets/data/category.json";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  initialMode?: "region" | "category";
  onChange?: (mode: "region" | "category", selected: string) => void;
  styles: any;
};

/**
 * ChipsFilter: encapsule les deux modes (region / category) et la liste de chips.
 * Le style utilisé est fourni par le parent via `styles` (afin de garantir
 * exactement le même rendu que l'original).
 */
export default function ChipsFilter({
  initialMode = "region",
  onChange,
  styles,
}: Props) {
  const { user } = useAuth();

  const categoriesList = React.useMemo(
    () =>
      Array.isArray(category) ? category : (category as any)?.categories || [],
    []
  );

  // compute user's department and category from imported data
  const userDepartment = React.useMemo(() => {
    return departements.find((d: any) => d.code === user?.department_code);
  }, [user]);

  const userCategory = React.useMemo(() => {
    return categoriesList.find(
      (c: any) => String(c.id) === String(user?.category_id)
    );
  }, [user, categoriesList]);

  // Internal UI state
  const [modeState, setModeState] = React.useState<"region" | "category">(
    initialMode
  );
  const [, setDepartmentSelected] = React.useState<string>(() =>
    userDepartment ? userDepartment.code : ""
  );
  const [, setCategorySelected] = React.useState<string>(() =>
    userCategory ? userCategory.id : ""
  );

  const [selected, setSelected] = React.useState<string>(() =>
    initialMode === "region"
      ? userDepartment
        ? userDepartment.code
        : ""
      : userCategory
      ? userCategory.id
      : ""
  );

  // Notify parent when selection or mode changes
  React.useEffect(() => {
    onChange?.(modeState, selected);
  }, [modeState, selected, onChange]);

  // Construire items chips (même logique que dans ranking.tsx)
  const chipsItems = React.useMemo(() => {
    if (modeState === "region") {
      const userChip = userDepartment
        ? [
            {
              key: `dept-user-${userDepartment.code}`,
              label: userDepartment.nom,
              value: userDepartment.code,
            },
          ]
        : [];

      const others = departements
        .filter((d) => d.code !== userDepartment?.code)
        .map((d) => ({
          key: `dept-${d.code}`,
          label: d.nom,
          value: d.code,
        }));

      return [...userChip, ...others];
    }

    const userCatChip = userCategory
      ? [
          {
            key: `cat-user-${userCategory.id}`,
            label: userCategory.name,
            value: userCategory.id,
          },
        ]
      : [];

    const otherCats = categoriesList
      .filter((c: any) => c.id !== userCategory?.id)
      .map((c: any) => ({
        key: `cat-${c.id}`,
        label: c.name,
        value: c.id,
      }));

    return [...userCatChip, ...otherCats];
  }, [modeState, userDepartment, userCategory, categoriesList]);

  return (
    <>
      {/* Boutons de switch Region / Category */}
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => {
            setModeState("region");
            setDepartmentSelected(userDepartment?.code || "");
            setSelected(userDepartment?.code || "");
          }}
          style={({ pressed }: any) => [
            styles.modeButton,
            modeState === "region"
              ? styles.modeButtonActive
              : styles.modeButtonInactive,
            pressed && { opacity: 0.75 },
          ]}
        >
          <ThemedText
            style={
              modeState === "region"
                ? styles.modeTextActive
                : styles.modeTextInactive
            }
          >
            Par région
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => {
            setModeState("category");
            setCategorySelected(userCategory?.id || "");
            setSelected(userCategory?.id || "");
          }}
          style={({ pressed }: any) => [
            styles.modeButton,
            modeState === "category"
              ? styles.modeButtonActive
              : styles.modeButtonInactive,
            pressed && { opacity: 0.75 },
          ]}
        >
          <ThemedText
            style={
              modeState === "category"
                ? styles.modeTextActive
                : styles.modeTextInactive
            }
          >
            Par catégorie
          </ThemedText>
        </Pressable>
      </View>

      {/* Chips horizontales */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {chipsItems.length === 0 ? (
          <View style={styles.emptyChip}>
            <ThemedText style={styles.chipText}>Aucun</ThemedText>
          </View>
        ) : (
          chipsItems.map((item: any) => {
            const value = item.value;
            const active = selected === value;
            return (
              <ChipButton
                key={item.key}
                label={item.label}
                selected={active}
                onPress={() => {
                  setSelected(value);
                  if (modeState === "category") setCategorySelected(value);
                  else setDepartmentSelected(value);
                }}
                style={styles.chip}
              />
            );
          })
        )}
      </ScrollView>
    </>
  );
}
