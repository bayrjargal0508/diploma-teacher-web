"use client";
import { useEffect, useState } from "react";
import { subjectRegister, getAimag, getDuureg, getSchool } from "@/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ApiResponse } from "@/lib/types";

interface Subject {
  id: string;
  name: string;
}

interface Location {
  locationId: string;
  name: string;
}

interface School {
  id: string;
  name: string;
}

type AimagResponse = ApiResponse<Location[]>;
type DistrictResponse = ApiResponse<Location[]>;
type SchoolResponse = ApiResponse<School[]>;

interface LanguageDropdownProps {
  onSelect?: (subjectId: string) => void;
  onLocationChange?: (data: {
    aimagId: string;
    duuregId: string;
    schoolId: string;
    gender: string;
  }) => void;
}

export default function RegisterDropdown({
  onSelect,
  onLocationChange,
}: LanguageDropdownProps) {
  const [selected, setSelected] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [cityData, setCityData] = useState<Location[]>([]);
  const [districtData, setDistrictData] = useState<Location[]>([]);
  const [schoolData, setSchoolData] = useState<School[]>([]);

  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
    null
  );
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("");

  const genders = [
    { id: "MALE", name: "Эрэгтэй" },
    { id: "FEMALE", name: "Эмэгтэй" },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectRegister();
        setSubjects(response);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = (await getAimag()) as AimagResponse;
        if (response.result) {
          setCityData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      const fetchDistricts = async () => {
        try {
          const response = (await getDuureg(selectedCityId)) as DistrictResponse
          setDistrictData(response.data);
          setSchoolData([]);
          setSelectedDistrictId(null);
          setSelectedSchoolId(null);
        } catch (error) {
          console.error("Failed to fetch districts:", error);
          setDistrictData([]);
        }
      };
      fetchDistricts();
    }
  }, [selectedCityId]);

  useEffect(() => {
    if (selectedDistrictId) {
      const fetchSchools = async () => {
        try {
          const response  = (await getSchool(selectedDistrictId)) as SchoolResponse;
          setSchoolData(response.data);
          setSelectedSchoolId(null);
        } catch (error) {
          console.error("Failed to fetch schools:", error);
          setSchoolData([]);
        }
      };
      fetchSchools();
    }
  }, [selectedDistrictId]);

  useEffect(() => {
    if (
      selectedCityId &&
      selectedDistrictId &&
      selectedSchoolId &&
      selectedGender &&
      onLocationChange
    ) {
      onLocationChange({
        aimagId: selectedCityId,
        duuregId: selectedDistrictId,
        schoolId: selectedSchoolId,
        gender: selectedGender,
      });
    }
  }, [
    selectedCityId,
    selectedDistrictId,
    selectedSchoolId,
    selectedGender,
    onLocationChange,
  ]);

  const handleSelect = (subject: Subject) => {
    setSelected(subject);
    onSelect?.(subject.id);
  };

  const handleCitySelect = (cityId: string) => setSelectedCityId(cityId);
  const handleDistrictSelect = (districtId: string) =>
    setSelectedDistrictId(districtId);
  const handleSchoolSelect = (schoolId: string) =>
    setSelectedSchoolId(schoolId);
  const handleGenderSelect = (gender: string) => setSelectedGender(gender);

  const selectedCity = cityData?.find(
    (city) => city.locationId === selectedCityId
  );
  const selectedDistrict = districtData?.find(
    (district) => district.locationId === selectedDistrictId
  );
  const selectedSchool = schoolData?.find(
    (school) => school.id === selectedSchoolId
  );

  return (
    <div className="space-y-4">
      {/* Gender */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-[300px] flex items-center justify-between gap-2 rounded-md border border-stroke-border bg-background px-4 py-2 text-sm outline-hidden hover:bg-accent">
            <span>
              {selectedGender
                ? genders.find((g) => g.id === selectedGender)?.name
                : "Хүйс сонгоно уу"}
            </span>
            <ChevronDown className="size-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[300px]">
            {genders.map((gender) => (
              <DropdownMenuItem
                key={gender.id}
                onClick={() => handleGenderSelect(gender.id)}
                className={selectedGender === gender.id ? "bg-accent" : ""}
              >
                {gender.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* City/Aimag Dropdown */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 rounded-md border border-stroke-border bg-background px-4 py-2 text-sm outline-hidden hover:bg-accent">
            <span>{selectedCity ? selectedCity.name : "Аймаг сонгоно уу"}</span>
            <ChevronDown className="size-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[300px] max-h-[300px] overflow-y-auto"
          >
            {cityData.length === 0 ? (
              <DropdownMenuItem disabled>
                Аймаг ачааллаж байна...
              </DropdownMenuItem>
            ) : (
              cityData.map((city) => (
                <DropdownMenuItem
                  key={`city-${city.locationId || city.name}`}
                  onClick={() => handleCitySelect(city.locationId)}
                  className={
                    selectedCityId === city.locationId ? "bg-accent" : ""
                  }
                >
                  {city.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* District/Duureg Dropdown */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={!selectedCityId}
            className="w-full flex items-center justify-between gap-2 rounded-md border border-stroke-border bg-background px-4 py-2 text-sm outline-hidden hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {selectedDistrict ? selectedDistrict.name : "Дүүрэг сонгоно уу"}
            </span>
            <ChevronDown className="size-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[300px] max-h-[300px] overflow-y-auto"
          >
            {districtData.length === 0 ? (
              <DropdownMenuItem disabled>
                {selectedCityId
                  ? "Дүүрэг ачааллаж байна..."
                  : "Эхлээд аймаг сонгоно уу"}
              </DropdownMenuItem>
            ) : (
              districtData.map((district) => (
                <DropdownMenuItem
                  key={`district-${district.locationId || district.name}`}
                  onClick={() => handleDistrictSelect(district.locationId)}
                  className={
                    selectedDistrictId === district.locationId
                      ? "bg-accent"
                      : ""
                  }
                >
                  {district.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* School Dropdown */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={!selectedDistrictId}
            className="w-full flex items-center justify-between gap-2 rounded-md border border-stroke-border bg-background px-4 py-2 text-sm outline-hidden hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {selectedSchool ? selectedSchool.name : "Сургууль сонгоно уу"}
            </span>
            <ChevronDown className="size-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[300px] max-h-[300px] overflow-y-auto"
          >
            {schoolData.length === 0 ? (
              <DropdownMenuItem disabled>
                {selectedDistrictId
                  ? "Сургууль ачааллаж байна..."
                  : "Эхлээд дүүрэг сонгоно уу"}
              </DropdownMenuItem>
            ) : (
              schoolData.map((school) => (
                <DropdownMenuItem
                  key={`school-${school.id || school.name}`}
                  onClick={() => handleSchoolSelect(school.id)}
                  className={selectedSchoolId === school.id ? "bg-accent" : ""}
                >
                  {school.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* subject */}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 rounded-md border border-stroke-border bg-background px-4 py-2 text-sm outline-hidden hover:bg-accent">
            <span>{selected ? selected.name : "Хичээлээ сонгоно уу"}</span>
            <ChevronDown className="size-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[300px]">
            {subjects.length === 0 ? (
              <DropdownMenuItem disabled>
                Хичээл сонгоход алдаа гарлаа
              </DropdownMenuItem>
            ) : (
              subjects.map((subject) => (
                <DropdownMenuItem
                  key={subject.id}
                  onClick={() => handleSelect(subject)}
                  className={selected?.id === subject.id ? "bg-accent" : ""}
                >
                  {subject.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
