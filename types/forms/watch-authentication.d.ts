export interface DocumentsAudit {
  warranty_card_path?: string;
  purchase_receipt_path?: string;
  service_records_path?: string;
  is_authorized_dealer?: boolean;
  warranty_card_notes?: string;
  service_history_notes?: string;
}

export interface SerialInfo {
  serial_number?: string;
  model_number?: string;
  serial_found_location?: string;
  matches_documents?: boolean;
  engraving_quality?: string;
  notes?: string;
}

export interface CaseAnalysis {
  case_material_verified?: boolean;
  case_weight_feel?: string;
  finishing_transitions?: string;
  bezel_action?: string;
  crystal_type?: string;
  laser_etched_crown?: boolean;
  crown_logo_sharpness?: string;
  notes?: string;
}

export interface DialAnalysis {
  dial_text_quality?: string;
  lume_application?: string;
  cyclops_magnification?: string;
  date_alignment?: boolean;
  notes?: string;
}

export interface BraceletAnalysis {
  bracelet_link_type?: string;
  connection_type?: string;
  clasp_action?: string;
  micro_adjustment_functioning?: boolean;
  clasp_engravings?: string;
  notes?: string;
}

export interface MovementAnalysis {
  movement_caliber?: string;
  movement_engraving_quality?: string;
  has_cotes_de_geneve?: boolean;
  has_perlage?: boolean;
  movement_other?: string;
  has_purple_reversing_wheels?: boolean;
  has_blue_parachrom_hairspring?: boolean;
  movement_notes?: string;
}

export interface PerformanceTest {
  rate_seconds_per_day?: number;
  amplitude_degrees?: number;
  beat_error_ms?: number;
  power_reserve_test_result?: string;
  time_setting_works?: boolean;
  date_change_works?: boolean;
  chronograph_works?: string;
  notes?: string;
}

export interface WatchAuthentication {
  id: string;
  name: string;
  user_information?: string;
  brand: string;
  authenticity_verdict?: string;
  estimated_production_year?: string;
  final_summary?: string;
  date_of_sale?: string;
  created_at?: string;
  updated_at?: string;

  // Nested objects matching your JSON
  documents?: DocumentsAudit;
  serial_info?: SerialInfo;
  case_analysis?: CaseAnalysis;
  dial_analysis?: DialAnalysis;
  bracelet_analysis?: BraceletAnalysis;
  movement_analysis?: MovementAnalysis;
  performance_test?: PerformanceTest;

  final_condition_and_grading?: string;
}

