import React from "react"
import CustomDrawer from "@/components/CustomDrawer"
import { Edit, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAddEditCategoryDrawer } from "@/lib/hooks/use-add-edit-category-drawer"

export interface CategoryFormData {
  name: string
  type: "expense" | "income"
  icon: string
  color: string
}

interface EditCategoryProps {
  trigger: React.ReactNode
  category: {
    id: string
    name: string
    type: "expense" | "income"
    icon: string
    color: string
  }
}

export const EditCategory = ({ trigger, category }: EditCategoryProps) => {
  const {
    isOpen,
    openDrawer,
    closeDrawer,
    formData,
    setFormData,
    handleSubmit,
    isSubmitDisabled,
    isLoading,
  } = useAddEditCategoryDrawer()

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const iconOptions = [
    // Food & Drinks
    "🍔",
    "🍽️",
    "☕",
    "🍕",
    "🍦",
    "🍎",
    "🥗",
    "🍜",
    "🍣",
    "🍖",
    "🍗",
    "🥩",
    "🥓",
    "🍳",
    "🥚",
    "🥖",
    "🥨",
    "🧀",
    "🥛",
    "🍼",
    "🍯",
    "🥜",
    "🌰",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🌽",
    "🥕",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    // Transportation
    "⛽",
    "🚗",
    "🚌",
    "🚇",
    "🚲",
    "✈️",
    "🚢",
    "🚅",
    "🛵",
    "🚁",
    "🚀",
    "🛸",
    "🛥️",
    "🚤",
    "⛴️",
    "🛩️",
    "🛫",
    "🛬",
    "🛰️",
    // Shopping & Fashion
    "🛒",
    "🛍️",
    "👕",
    "👖",
    "👟",
    "👜",
    "💄",
    "🧴",
    "💍",
    "👑",
    "👒",
    "🎩",
    "🧢",
    "👡",
    "👠",
    "👢",
    "👞",
    "🥾",
    "🥿",
    "🧦",
    "🧤",
    "🧣",
    "👔",
    "👕",
    "👖",
    "🧥",
    "👗",
    "👘",
    "👙",
    // Technology
    "📱",
    "💻",
    "🖥️",
    "⌨️",
    "🖱️",
    "🖨️",
    "📷",
    "📹",
    "📺",
    "📻",
    "🎙️",
    "🎚️",
    "🎛️",
    "📼",
    "💿",
    "💾",
    "📀",
    // Entertainment
    "🎬",
    "🎮",
    "🎵",
    "🎨",
    "📚",
    "🎭",
    "🎪",
    "🎯",
    "🎲",
    "🎸",
    "🎹",
    "🎺",
    "🎻",
    "🥁",
    "🎤",
    "🎧",
    "🎼",
    // Money & Finance
    "💰",
    "📈",
    "💵",
    "💳",
    "🏦",
    "📊",
    "💎",
    "🏆",
    "🎁",
    "💼",
    "📉",
    "💱",
    "💲",
    "🪙",
    "💴",
    "💶",
    "💷",
    // Health & Medical
    "🏥",
    "💊",
    "🩺",
    "🦷",
    "👨‍⚕️",
    "🩹",
    "🩻",
    "🧬",
    "🔬",
    "🧪",
    "🧫",
    "🦠",
    "🌡️",
    "🧹",
    "🪠",
    "🧻",
    "🧺",
    "🧽",
    "🪣",
    "🧴",
    "🧷",
    "🪡",
    "🧶",
    "🪢",
    "🧸",
    "🪁",
    "🪃",
    // Education
    "🎓",
    "📝",
    "✏️",
    "📖",
    "🎒",
    "🏫",
    "👨‍🏫",
    "📋",
    "📊",
    "📚",
    "🖊️",
    "🖋️",
    "✒️",
    "🖌️",
    "🖍️",
    "📐",
    "📏",
    "🧮",
    "🔢",
    "🔤",
    "🔡",
    "🔠",
    // Buildings & Places
    "🏠",
    "🏢",
    "🏪",
    "🏨",
    "🏰",
    "⛪",
    "🕌",
    "🕍",
    "🛕",
    "⛩️",
    "🗽",
    "🗼",
    "🎡",
    "🎢",
    "🎠",
    "⛲",
    "⛱️",
    "🏖️",
    "🏝️",
    "🏔️",
    "⛰️",
    "🌋",
    "🗻",
    "🏕️",
    "⛺",
    "🏜️",
    "🏞️",
    "🏟️",
    "🏛️",
    "🏗️",
    "🧱",
    "🏘️",
    "🏚️",
    "🏡",
    "🏭",
    "🏬",
    "🏣",
    "🏤",
    "🏥",
    "🏩",
    "💒",
    // Nature & Weather
    "🌱",
    "🌲",
    "🌳",
    "🌴",
    "🌵",
    "🌾",
    "🌿",
    "☘️",
    "🍀",
    "🍁",
    "🍂",
    "🍃",
    "🌺",
    "🌸",
    "🌼",
    "🌻",
    "🌞",
    "🌝",
    "🌛",
    "🌜",
    "🌚",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌙",
    "🌎",
    "🌍",
    "🌏",
    "💫",
    "⭐",
    "🌟",
    "✨",
    "⚡",
    "☄️",
    "💥",
    "🔥",
    "🌪️",
    "🌈",
    "☀️",
    "🌤️",
    "⛅",
    "🌥️",
    "☁️",
    "🌦️",
    "🌧️",
    "⛈️",
    "🌩️",
    "🌨️",
    "🌬️",
    "💨",
    "💧",
    "💦",
    "☔",
    "☂️",
    "🌊",
    // Animals
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🦟",
    "🦗",
    "🕷️",
    "🕸️",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    // Objects & Tools
    "🔧",
    "🔨",
    "⚒️",
    "🛠️",
    "⛏️",
    "🔩",
    "⚙️",
    "🧱",
    "⛓️",
    "🧲",
    "🔫",
    "💣",
    "🧨",
    "🪓",
    "🔪",
    "🗡️",
    "⚔️",
    "🛡️",
    "🚬",
    "⚰️",
    "⚱️",
    "🏺",
    "🔮",
    "📿",
    "🧿",
    "💈",
    "⚗️",
    "🔭",
    "🔬",
    "🕳️",
    "🩹",
    "🩺",
    "💊",
    "💉",
    "🩸",
    "🧬",
    "🦠",
    "🧫",
    "🧪",
    "🌡️",
    "🧹",
    "🪠",
    "🧻",
    "🧺",
    "🧽",
    "🪣",
    "🧴",
    "🧷",
    "🪡",
    "🧶",
    "🪢",
    "🧸",
    "🪁",
    "🪃",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    // Sports & Activities
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛷️",
    "⛸️",
    "🥌",
    "🎿",
    "⛷️",
    "🏂",
    "🏋️",
    "🤼",
    "🤸",
    "⛹️",
    "🤺",
    "🤾",
    "🏊",
    "🏊‍♂️",
    "🏊‍♀️",
    "🚣",
    "🚣‍♂️",
    "🚣‍♀️",
    "🧘",
    "🧘‍♂️",
    "🧘‍♀️",
    "🏄",
    "🏄‍♂️",
    "🏄‍♀️",
    "🏃",
    "🏃‍♂️",
    "🏃‍♀️",
    "🚶",
    "🚶‍♂️",
    "🚶‍♀️",
    // Symbols & Signs
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "🆔",
    "⚛️",
    "🉑",
    "☢️",
    "☣️",
    "📴",
    "📳",
    "🈶",
    "🈚",
    "🈸",
    "🈺",
    "🈷️",
    "✴️",
    "🆚",
    "💮",
    "🉐",
    "㊙️",
    "㊗️",
    "🈴",
    // Flags & Countries
    "🏁",
    "🚩",
    "🎌",
    "🏴",
    "🏳️",
    "🏳️‍🌈",
    "🏴‍☠️",
    "🇦🇫",
    "🇦🇽",
    "🇦🇱",
    "🇩🇿",
    "🇦🇸",
    "🇦🇩",
    "🇦🇴",
    "🇦🇮",
    "🇦🇶",
    "🇦🇷",
    "🇦🇲",
    "🇦🇼",
    "🇦🇺",
    "🇦🇹",
    "🇦🇿",
    "🇧🇸",
    "🇧🇭",
    "🇧🇩",
    "🇧🇧",
    "🇧🇾",
    "🇧🇪",
    "🇧🇿",
    "🇧🇯",
    "🇧🇲",
    "🇧🇹",
    "🇧🇴",
    "🇧🇦",
    "🇧🇼",
    "🇧🇷",
    "🇮🇴",
    "🇻🇬",
    "🇧🇳",
    "🇧🇬",
    "🇧🇫",
    "🇧🇮",
    "🇰🇭",
    "🇨🇲",
    "🇨🇦",
    "🇨🇻",
    "🇰🇾",
    "🇨🇫",
    "🇹🇩",
    "🇨🇱",
    "🇨🇳",
    "🇨🇽",
    "🇨🇨",
    "🇨🇴",
    "🇰🇲",
    "🇨🇬",
    "🇨🇩",
    "🇨🇰",
    "🇨🇷",
    "🇭🇷",
    // Miscellaneous
    "🎯",
    "🎲",
    "🎮",
    "🎰",
    "🎳",
    "🎨",
    "🎬",
    "🎤",
    "🎧",
    "🎼",
    "🎹",
    "🎸",
    "🎺",
    "🎻",
    "🥁",
    "🎤",
    "🎧",
    "🎼",
    "🎹",
    "🎸",
    "🎺",
    "🎻",
    "🥁",
    "🎤",
    "🎧",
    "🎼",
    "🎹",
    "🎸",
    "🎺",
    "🎻",
    "🥁",
    "🎤",
    "🎧",
    "🎼",
    "🎹",
    "🎸",
    "🎺",
    "🎻",
    "🥁",
    "🎤",
    "🎧",
    "🎼",
    "🎹",
    "🎸",
    "🎺",
  ]

  const colorOptions = [
    { name: "Gray", value: "bg-gray-400" },
    { name: "Red", value: "bg-red-400" },
    { name: "Orange", value: "bg-orange-400" },
    { name: "Yellow", value: "bg-yellow-400" },
    { name: "Green", value: "bg-green-400" },
    { name: "Blue", value: "bg-blue-400" },
    { name: "Purple", value: "bg-purple-400" },
    { name: "Pink", value: "bg-pink-400" },
    { name: "Indigo", value: "bg-indigo-400" },
    { name: "Teal", value: "bg-teal-400" },
    { name: "Cyan", value: "bg-cyan-400" },
    { name: "Lime", value: "bg-lime-400" },
    { name: "Emerald", value: "bg-emerald-400" },
    { name: "Rose", value: "bg-rose-400" },
    { name: "Violet", value: "bg-violet-400" },
  ]

  const handleFormSubmit = async () => {
    try {
      await handleSubmit()
      // The drawer will be closed automatically by the hook after successful submission
    } catch (error) {
      console.error("Failed to update category:", error)
    }
  }

  const handleOpenDrawer = () => {
    openDrawer(category)
  }

  return (
    <CustomDrawer
      trigger={trigger}
      title="Edit Category"
      SubmitIcon={Edit}
      submitTitle="Update Category"
      submitDisabled={isSubmitDisabled}
      submitLoading={isLoading}
      onSubmit={handleFormSubmit}
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          handleOpenDrawer()
        } else {
          closeDrawer()
        }
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label className="text-gray-800 font-medium">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <input
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full text-sm border border-gray-300 bg-white rounded-sm py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Category Type */}
          <div className="space-y-2">
            <Label className="text-gray-800 font-medium">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value as "expense" | "income")}
            >
              <SelectTrigger className="w-full border-gray-300 bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Icon Selection */}
        <div className="space-y-2">
          <Label className="text-gray-800 font-medium">
            Icon <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {iconOptions.map((icon, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleInputChange("icon", icon)}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 transition-colors",
                  formData.icon === icon ? "bg-purple-100 border-2 border-purple-500" : ""
                )}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <Label className="text-gray-800 font-medium">
            Color <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleInputChange("color", color.value)}
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center transition-all",
                  color.value,
                  formData.color === color.value
                    ? "ring-2 ring-purple-500 ring-offset-2"
                    : "hover:scale-105"
                )}
              >
                {formData.color === color.value && (
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label className="text-gray-800 font-medium">Preview</Label>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg",
                  formData.color
                )}
              >
                {formData.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{formData.name || "Category Name"}</div>
                <div className="text-sm text-gray-500 capitalize">{formData.type || "Type"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  )
}
