<template>
  <label :for="id" class="form-label">{{ label }}</label>
  <input
      v-if="type === 'text'"
      :type="type"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      class="form-input"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
  <el-date-picker
      v-else-if="type === 'datetime'"
      v-model="internalValue"
      type="datetime"
      :placeholder="placeholder || '选择日期和时间'"
      format="YYYY-MM-DD HH:mm:ss"
      value-format="YYYY-MM-DD HH:mm:ss"
      class="form-datepicker"
      @change="updateValue"
  ></el-date-picker>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'FormComponents',
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalValue = ref(props.modelValue);

    // Watch for changes in props.modelValue and update internalValue
    watch(
        () => props.modelValue,
        (newValue) => {
          internalValue.value = newValue;
        }
    );

    // Emit updated value when internalValue changes
    const updateValue = (value: string) => {
      emit('update:modelValue', value);
    };

    return {
      internalValue,
      updateValue,
    };
  },
});
</script>
